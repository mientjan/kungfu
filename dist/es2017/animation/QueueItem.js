export class QueueItem {
    constructor(label, from, to, times = 1, delay = 0) {
        this._complete = null;
        if (from > to) {
            throw new Error('argument "from" cannot be bigger than argument "to"');
        }
        this.label = label;
        this.from = from;
        this.to = to;
        this.duration = to - from;
        this.times = times;
        this.delay = delay;
    }
    then(complete) {
        this._complete = complete;
        return this;
    }
    finish() {
        if (this._complete) {
            this._complete.call(this);
        }
        return this;
    }
    destruct() {
        this.label = null;
        this._complete = null;
    }
}
