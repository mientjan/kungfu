export class Queue {
    constructor() {
        this._list = [];
        this._listLength = 0;
        this.current = null;
    }
    add(item) {
        this._list.push(item);
        this._listLength++;
        return this;
    }
    next() {
        this.kill();
        if (this._listLength > 0) {
            this.current = this._list.shift();
            this._listLength--;
        }
        else {
            this.current = null;
        }
        return this.current;
    }
    hasNext() {
        return this._listLength > 0;
    }
    end(all = false) {
        if (all) {
            this._list.length = 0;
            this._listLength = 0;
        }
        if (this.current) {
            this.current.times = 1;
        }
        return this;
    }
    kill(all = false) {
        if (all) {
            this._list.length = 0;
            this._listLength = 0;
        }
        if (this.current) {
            let current = this.current;
            this.current = null;
            current.finish();
            current.destruct();
        }
        return this;
    }
}
