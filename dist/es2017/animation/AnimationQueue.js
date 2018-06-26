import { Queue } from "./Queue";
class AnimationQueue extends Queue {
    constructor(fps, unit = 1000) {
        super();
        this.frame = 0;
        /**
         * Will stop
         * @property _freeze
         * @type {boolean}
         */
        this._freeze = false;
        this._hasStopped = false;
        this._time = 0;
        this._fpms = 0;
        this._fpms = unit / fps;
    }
    onTick(delta) {
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
    }
    hasStopped() {
        return !this.current && !this.hasNext();
    }
    next() {
        var next = super.next();
        if (next) {
            this.reset();
        }
        return next;
    }
    getFrame() {
        return this.frame | 0;
    }
    reset() {
        this._freeze = false;
        this._time = this._time % this._fpms;
    }
}
export default AnimationQueue;
