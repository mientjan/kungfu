import * as PIXI from 'pixi.js';
var BaseTexture = PIXI.BaseTexture;
var Texture = PIXI.Texture;
var Rectangle = PIXI.Rectangle;
var Sprite = PIXI.Sprite;
import Load from "../http/Load";
import HTTPRequest from "../http/HTTPRequest";
function isPowerOfTwo(value) {
    return value !== 0 && (value & (value - 1)) === 0;
}
export default class PIXISpritePack {
    constructor(jsonOrUrl) {
        this._cache = {};
        this._asset = {};
        this._assetBaseTexture = {};
        this._assetTextureCache = {};
        if (typeof jsonOrUrl == 'string') {
            this._url = jsonOrUrl;
        }
        else {
            this._json = jsonOrUrl;
        }
    }
    addAsset(key, path) {
        if (this._load) {
            throw new Error('can not add asset when laod as been called.');
        }
        if (this._asset[key]) {
            throw new Error('asset key already exists');
        }
        this._asset[key] = new Load(path);
    }
    getJson() {
        if (!this._getJson) {
            if (this._url) {
                this._getJson = HTTPRequest.getJSON(this._url);
            }
            else {
                this._getJson = Promise.resolve(this._json);
            }
        }
        return this._getJson;
    }
    load() {
        if (!this._load) {
            this._load = this.getJson().then(json => {
                return new Load(json.meta.image);
            }).then(img => {
                this._baseTexture = BaseTexture.from(img);
                if (isPowerOfTwo(img.naturalWidth) && isPowerOfTwo(img.naturalHeight)) {
                    this._baseTexture.mipmap = true;
                }
                return this;
            }).then(pack => {
                let assetKeys = Object.keys(this._asset);
                let assets = this._asset;
                if (assetKeys.length == 0) {
                    return pack;
                }
                return Promise.all(assetKeys.map(key => assets[key])).then(assets => {
                    assets.forEach((asset, key) => {
                        this._assetTextureCache[assetKeys[key]] = Texture.from(asset);
                    });
                }).then(() => pack);
            });
        }
        return this._load;
    }
    getFrame(id) {
        if (!this._cache[id] && this._json.frames[id]) {
            let data = this._json.frames[id];
            // let rect = new Rectangle(data.spriteSourceSize.x, data.spriteSourceSize.y, data.spriteSourceSize.w, data.spriteSourceSize.h);
            let rect = new Rectangle(data.frame.x, data.frame.y, data.frame.w, data.frame.h);
            // let origin = new Rectangle(0, 0, data.sourceSize.width, data.sourceSize.height);
            // (baseTexture: BaseTexture, frame?: Rectangle, orig?: Rectangle, trim?: Rectangle, rotate?: number)
            this._cache[id] = new Texture(this._baseTexture, rect); //, origin)
        }
        if (this._cache[id]) {
            return this._cache[id];
        }
        else if (this._assetTextureCache[id]) {
            return this._assetTextureCache[id];
        }
        else {
            throw new Error('no asset found');
        }
    }
    getSpriteFromFrame(id) {
        return new Sprite(this.getFrame(id));
    }
}
