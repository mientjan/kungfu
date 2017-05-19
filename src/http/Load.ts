
import FileType from "./FileType";
import LoadStatus from "./LoadStatus";
import {loadAudio, loadImage} from "./LoadUtils";
import {default as deferred, IDeffered} from "../promise/deferred";

export default class Load<T extends any>
{
	public static all<U>(load:Array<Promise<U>>, progress:(progress:number) => void):Promise<Array<U>>
	{
		let totalProgress = Array(load.length).fill(0);

		let list:Array<any> = load.map((val:any, index) => {

			let method = data => {
				totalProgress[index] = 1;
				progress(totalProgress.reduce((acc, curr) => acc + curr, 0) / load.length);
				return data;
			};

			return val.then( <any> method);
		});

		return Promise.all(list);
	}

	public static sequence<U>(load:Array<(resolve) => any>, progress:(progress:number) => void):Promise<Array<U>>
	{
		let totalProgress = Array(load.length).fill(0);
		let result = [];

		let prom = new Promise(load.shift());

		load.forEach((loadItem, index) => {
			prom = prom.then(item => {
				result.push(item);

				totalProgress[index] = 1;
				progress(totalProgress.reduce((acc, curr) => acc + curr, 0) / load.length);

				return new Promise(loadItem);
			})
		})

		return prom.then(item => {
			result.push(item);

			return result;
		});
	}

	public readonly src:string;
	public get status():LoadStatus
	{
		return this._status;
	}

	protected def:IDeffered<T>;
	private _status:LoadStatus = LoadStatus.IDLE;

	/**
	 *
	 * @param src
	 */
	constructor(src:string)
	{
		this.src = src;
		this.def = deferred();
	}

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	public then(onfulfilled?: ((value: T) => T | PromiseLike<T>) | undefined | null, onrejected?: ((reason: any) => T | PromiseLike<T>) | undefined | null): Promise<T>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	public then<TResult>(onfulfilled: ((value: T) => T | PromiseLike<T>) | undefined | null, onrejected: (reason: any) => TResult | PromiseLike<TResult>): Promise<T | TResult>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	public then<TResult>(onfulfilled: (value: T) => TResult | PromiseLike<TResult>, onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<TResult>;

	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onfulfilled The callback to execute when the Promise is resolved.
	 * @param onrejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	public then<TResult1, TResult2>(onfulfilled: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected: (reason: any) => TResult2 | PromiseLike<TResult2>): Promise<TResult1 | TResult2>
	{
		if(this._status == LoadStatus.IDLE)
		{
			this._loadAsset();
		}

		return this.def.promise.then(onfulfilled, onrejected);
	}

	protected _loadAsset():void
	{

		switch(this.getType(this.src))
		{
			case FileType.IMAGE:{
				this._status = LoadStatus.LOAD;

				loadImage(this.src).then(img => this.def.resolve(<any> img)).catch(<any> this.def.reject);
				break;
			}

			case FileType.AUDIO:{
				this._status = LoadStatus.LOAD;

				loadAudio(this.src).then(buffer => this.def.resolve(<any> buffer)).catch(<any> this.def.reject);
				break;
			}
		}
	}

	protected getType(src:string):FileType
	{
		let extension = src.split('.').pop();

		switch (extension){
			case 'jpg':
			case 'bpm':
			case 'tiff':
			case 'png':
			{
				return FileType.IMAGE;
			}

			case 'wav':
			case 'mp3':
			case 'ogg':
			{
				return FileType.AUDIO;
			}

			default:
			{
				return FileType.UNKNOWN
			}
		}
	}

	public destruct():void
	{
		this.def.reject = void 0;
		this.def.resolve = void 0;
		this.def.promise = void 0;

		this.def = void 0;
	}
}

