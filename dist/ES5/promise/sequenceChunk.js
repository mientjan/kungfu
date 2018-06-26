"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequence_1 = require("./sequence");
var all_1 = require("./all");
function sequenceChunk(load, progress, chunkLength) {
    var _this = this;
    if (chunkLength === void 0) { chunkLength = 10; }
    var loadClone = load.concat([]);
    var totalProgress = Array(Math.ceil(loadClone.length / chunkLength)).fill(0);
    var resolveList = totalProgress.map(function (value, index) {
        return function (index, resolve) {
            var chunk = loadClone.splice(0, chunkLength);
            return all_1.default(chunk.map(function (value) { return new Promise(value); }), function (progressValue) {
                totalProgress[index] = progressValue;
                progress(totalProgress.reduce(function (acc, curr) { return acc + curr; }, 0) / totalProgress.length);
            }).then(function (result) {
                resolve(result);
            });
        }.bind(_this, index);
    });
    return sequence_1.default(resolveList, function (progress) { }).then(function (data) {
        return data.reduce(function (acc, curr) { return acc.concat(curr); }, []);
    });
}
exports.default = sequenceChunk;
