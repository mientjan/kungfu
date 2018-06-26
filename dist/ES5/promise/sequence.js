"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sum_1 = require("../math/sum");
function sequence(load, progress) {
    var totalProgress = Array(load.length).fill(0);
    var result = [];
    var prom = new Promise(load.shift());
    load.forEach(function (loadItem, index) {
        prom = prom.then(function (item) {
            result.push(item);
            totalProgress[index] = 1;
            progress(sum_1.default.apply(null, totalProgress) / load.length);
            return new Promise(loadItem);
        });
    });
    return prom.then(function (item) {
        result.push(item);
        return result;
    });
}
exports.default = sequence;
