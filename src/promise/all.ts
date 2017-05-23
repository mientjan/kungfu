import sum from "../math/sum";
export default function all<U>(load:Array<Promise<U>>, progress:(progress:number) => void):Promise<Array<U>>
{
	let totalProgress = Array(load.length).fill(0);

	let list:Array<any> = load.map((val:any, index) => {

		let method = data => {
			totalProgress[index] = 1;
			progress(sum.apply(null, totalProgress) / load.length);
			return data;
		};

		return val.then( <any> method);
	});

	return Promise.all(list);
}