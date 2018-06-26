"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var deferred_1 = require("./deferred");
var sum_1 = require("../math/sum");
/**
 * @author Mient-jan Stelling
 * @param {Array<(resolve, reject?) => any>} load
 * @param {(progress: number) => void}progress
 * @param {Number} bandWidth
 * @returns {Promise<Array<U>>}
 */
function stream(load, progress, bandWidth) {
    if (progress === void 0) { progress = function () { }; }
    if (bandWidth === void 0) { bandWidth = 10; }
    var loadClone = load.concat([]);
    var totalProgress = Array(loadClone.length).fill(0);
    var length = Math.min(loadClone.length, bandWidth);
    var result = Array(loadClone.length).fill(null);
    var def = deferred_1.default();
    var done = 0;
    var next = function () {
        if (loadClone.length) {
            var item = loadClone.pop();
            var index_1 = loadClone.length;
            var prom = new Promise(item).then(function (data) {
                result[index_1] = data;
                done++;
                totalProgress[index_1] = 1;
                progress(sum_1.default.apply(null, totalProgress) / totalProgress.length, data, index_1);
                next();
            }, function (err) {
                result[index_1] = err;
                done++;
                next();
            });
        }
        else if (done >= totalProgress.length) {
            def.resolve(result);
        }
    };
    for (var i = 0; i < length; i++) {
        next();
    }
    return def.promise;
}
exports.default = stream;
