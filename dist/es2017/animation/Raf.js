import { Signal2 } from 'seng-signals';
let time = 0;
let raf = -1;
let signals = [];
let length = signals.length;
let delta = 0;
let tick = (currTime) => {
    raf = requestAnimationFrame(tick);
    delta = currTime - time;
    time = currTime;
    for (var i = 0; i < length; i++) {
        signals[i].emit(time, delta);
    }
};
export default class Raf extends Signal2 {
    static start() {
        if (raf == -1 && length > 0) {
            raf = requestAnimationFrame(tick);
        }
    }
    static stop() {
        if (raf > -1 && length == 0) {
            cancelAnimationFrame(raf);
            raf = -1;
        }
    }
    connect(listener, prioritize) {
        if (!this.hasListeners()) {
            signals.push(this);
            length = signals.length;
        }
        return super.connect(listener, prioritize);
    }
    disconnect(conn) {
        super.disconnect(conn);
        if (!this.hasListeners()) {
            for (var i = 0; i < length; i++) {
                if (signals[i] === this) {
                    signals.splice(i, 1);
                }
            }
            length = signals.length;
        }
    }
}
