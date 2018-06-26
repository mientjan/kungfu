"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileType_1 = require("./FileType");
var LoadStatus_1 = require("./LoadStatus");
var LoadUtils_1 = require("./LoadUtils");
var deferred_1 = require("../promise/deferred");
var Load = /** @class */ (function () {
    /**
     *
     * @param src
     */
    function Load(src, type) {
        if (type === void 0) { type = null; }
        this._status = LoadStatus_1.default.IDLE;
        this.src = src;
        this.def = deferred_1.default();
        this.type = type;
    }
    Object.defineProperty(Load.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    Load.prototype.then = function (onfulfilled, onrejected) {
        if (this._status == LoadStatus_1.default.IDLE) {
            this._loadAsset();
        }
        return this.def.promise.then(onfulfilled, onrejected);
    };
    Load.prototype._loadAsset = function () {
        var _this = this;
        switch (this.getType(this.src)) {
            case FileType_1.default.IMAGE: {
                this._status = LoadStatus_1.default.LOAD;
                LoadUtils_1.loadImage(this.src).then(function (img) { return _this.def.resolve(img); }).catch(this.def.reject);
                break;
            }
            case FileType_1.default.AUDIO: {
                this._status = LoadStatus_1.default.LOAD;
                LoadUtils_1.loadAudio(this.src).then(function (buffer) { return _this.def.resolve(buffer); }).catch(this.def.reject);
                break;
            }
        }
    };
    Load.prototype.getType = function (src) {
        var extension = src.split('.').pop();
        switch (extension) {
            case 'jpg':
            case 'bpm':
            case 'tiff':
            case 'png':
                {
                    return FileType_1.default.IMAGE;
                }
            case 'wav':
            case 'mp3':
            case 'ogg':
                {
                    return FileType_1.default.AUDIO;
                }
            default:
                {
                    return FileType_1.default.UNKNOWN;
                }
        }
    };
    Load.prototype.destruct = function () {
        this.def.reject = void 0;
        this.def.resolve = void 0;
        this.def.promise = void 0;
        this.def = void 0;
    };
    return Load;
}());
exports.default = Load;
