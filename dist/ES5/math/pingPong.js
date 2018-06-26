"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pingPong(t, length) {
    if (t < 0)
        t = -t;
    var mod = t % length;
    // if mod is even
    if (Math.ceil(t / length) % 2 === 0) {
        return (mod === 0) ? 0 : length - (mod);
    }
    return (mod === 0) ? length : mod;
}
exports.pingPong = pingPong;
