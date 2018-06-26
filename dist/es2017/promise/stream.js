import deferred from "./deferred";
import sum from "../math/sum";
/**
 * @author Mient-jan Stelling
 * @param {Array<(resolve, reject?) => any>} load
 * @param {(progress: number) => void}progress
 * @param {Number} bandWidth
 * @returns {Promise<Array<U>>}
 */
export default function stream(load, progress = () => { }, bandWidth = 10) {
    let loadClone = load.concat([]);
    let totalProgress = Array(loadClone.length).fill(0);
    let length = Math.min(loadClone.length, bandWidth);
    let result = Array(loadClone.length).fill(null);
    let def = deferred();
    let done = 0;
    let next = () => {
        if (loadClone.length) {
            let item = loadClone.pop();
            let index = loadClone.length;
            let prom = new Promise(item).then(data => {
                result[index] = data;
                done++;
                totalProgress[index] = 1;
                progress(sum.apply(null, totalProgress) / totalProgress.length, data, index);
                next();
            }, err => {
                result[index] = err;
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
