"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sum_1 = require("../math/sum");
function all(load, progress) {
    var totalProgress = Array(load.length).fill(0);
    var list = load.map(function (val, index) {
        var method = function (data) {
            totalProgress[index] = 1;
            progress(sum_1.default.apply(null, totalProgress) / load.length);
            return data;
        };
        return val.then(method);
    });
    return Promise.all(list);
}
exports.default = all;
