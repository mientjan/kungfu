import sequence from "./sequence";
import all from "./all";
export default function sequenceChunk(load, progress, chunkLength = 10) {
    let loadClone = load.concat([]);
    let totalProgress = Array(Math.ceil(loadClone.length / chunkLength)).fill(0);
    let resolveList = totalProgress.map((value, index) => {
        return function (index, resolve) {
            let chunk = loadClone.splice(0, chunkLength);
            return all(chunk.map(value => new Promise(value)), progressValue => {
                totalProgress[index] = progressValue;
                progress(totalProgress.reduce((acc, curr) => acc + curr, 0) / totalProgress.length);
            }).then(result => {
                resolve(result);
            });
        }.bind(this, index);
    });
    return sequence(resolveList, progress => { }).then((data) => {
        return data.reduce((acc, curr) => acc.concat(curr), []);
    });
}
