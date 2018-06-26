"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function timeout(time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () { return resolve(void 0); }, time);
    });
}
exports.timeout = timeout;
