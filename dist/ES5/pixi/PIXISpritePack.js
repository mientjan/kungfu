"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PIXI = require("pixi.js");
var BaseTexture = PIXI.BaseTexture;
var Texture = PIXI.Texture;
var Rectangle = PIXI.Rectangle;
var Sprite = PIXI.Sprite;
var Load_1 = require("../http/Load");
var HTTPRequest_1 = require("../http/HTTPRequest");
function isPowerOfTwo(value) {
    return value !== 0 && (value & (value - 1)) === 0;
}
var PIXISpritePack = /** @class */ (function () {
    function PIXISpritePack(jsonOrUrl) {
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
    PIXISpritePack.prototype.addAsset = function (key, path) {
        if (this._load) {
            throw new Error('can not add asset when laod as been called.');
        }
        if (this._asset[key]) {
            throw new Error('asset key already exists');
        }
        this._asset[key] = new Load_1.default(path);
    };
    PIXISpritePack.prototype.getJson = function () {
        if (!this._getJson) {
            if (this._url) {
                this._getJson = HTTPRequest_1.default.getJSON(this._url);
            }
            else {
                this._getJson = Promise.resolve(this._json);
            }
        }
        return this._getJson;
    };
    PIXISpritePack.prototype.load = function () {
        var _this = this;
        if (!this._load) {
            this._load = this.getJson().then(function (json) {
                return new Load_1.default(json.meta.image);
            }).then(function (img) {
                _this._baseTexture = BaseTexture.from(img);
                if (isPowerOfTwo(img.naturalWidth) && isPowerOfTwo(img.naturalHeight)) {
                    _this._baseTexture.mipmap = true;
                }
                return _this;
            }).then(function (pack) {
                var assetKeys = Object.keys(_this._asset);
                var assets = _this._asset;
                if (assetKeys.length == 0) {
                    return pack;
                }
                return Promise.all(assetKeys.map(function (key) { return assets[key]; })).then(function (assets) {
                    assets.forEach(function (asset, key) {
                        _this._assetTextureCache[assetKeys[key]] = Texture.from(asset);
                    });
                }).then(function () { return pack; });
            });
        }
        return this._load;
    };
    PIXISpritePack.prototype.getFrame = function (id) {
        if (!this._cache[id] && this._json.frames[id]) {
            var data = this._json.frames[id];
            // let rect = new Rectangle(data.spriteSourceSize.x, data.spriteSourceSize.y, data.spriteSourceSize.w, data.spriteSourceSize.h);
            var rect = new Rectangle(data.frame.x, data.frame.y, data.frame.w, data.frame.h);
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
    };
    PIXISpritePack.prototype.getSpriteFromFrame = function (id) {
        return new Sprite(this.getFrame(id));
    };
    return PIXISpritePack;
}());
exports.default = PIXISpritePack;
