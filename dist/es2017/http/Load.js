import FileType from "./FileType";
import LoadStatus from "./LoadStatus";
import { loadAudio, loadImage } from "./LoadUtils";
import { default as deferred } from "../promise/deferred";
export default class Load {
    /**
     *
     * @param src
     */
    constructor(src, type = null) {
        this._status = LoadStatus.IDLE;
        this.src = src;
        this.def = deferred();
        this.type = type;
    }
    get status() {
        return this._status;
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then(onfulfilled, onrejected) {
        if (this._status == LoadStatus.IDLE) {
            this._loadAsset();
        }
        return this.def.promise.then(onfulfilled, onrejected);
    }
    _loadAsset() {
        switch (this.getType(this.src)) {
            case FileType.IMAGE: {
                this._status = LoadStatus.LOAD;
                loadImage(this.src).then(img => this.def.resolve(img)).catch(this.def.reject);
                break;
            }
            case FileType.AUDIO: {
                this._status = LoadStatus.LOAD;
                loadAudio(this.src).then(buffer => this.def.resolve(buffer)).catch(this.def.reject);
                break;
            }
        }
    }
    getType(src) {
        let extension = src.split('.').pop();
        switch (extension) {
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
                    return FileType.UNKNOWN;
                }
        }
    }
    destruct() {
        this.def.reject = void 0;
        this.def.resolve = void 0;
        this.def.promise = void 0;
        this.def = void 0;
    }
}
