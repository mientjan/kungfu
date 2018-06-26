"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Queue_1 = require("./Queue");
var AnimationQueue = /** @class */ (function (_super) {
    __extends(AnimationQueue, _super);
    function AnimationQueue(fps, unit) {
        if (unit === void 0) { unit = 1000; }
        var _this = _super.call(this) || this;
        _this.frame = 0;
        /**
         * Will stop
         * @property _freeze
         * @type {boolean}
         */
        _this._freeze = false;
        _this._hasStopped = false;
        _this._time = 0;
        _this._fpms = 0;
        _this._fpms = unit / fps;
        return _this;
    }
    AnimationQueue.prototype.onTick = function (delta) {
        var time = this._time += delta;
        if ((this.current != null || this.next() != null)) {
            var current = this.current;
            var from = current.from;
            var duration = current.duration;
            var times = current.times;
            var frame = (duration * time / (duration * this._fpms));
            if (times > -1 && times - (frame / duration) < 0) {
                this.next();
            }
            else {
                this.frame = from + (frame % duration);
            }
        }
    };
    AnimationQueue.prototype.hasStopped = function () {
        return !this.current && !this.hasNext();
    };
    AnimationQueue.prototype.next = function () {
        var next = _super.prototype.next.call(this);
        if (next) {
            this.reset();
        }
        return next;
    };
    AnimationQueue.prototype.getFrame = function () {
        return this.frame | 0;
    };
    AnimationQueue.prototype.reset = function () {
        this._freeze = false;
        this._time = this._time % this._fpms;
    };
    return AnimationQueue;
}(Queue_1.Queue));
exports.default = AnimationQueue;
