import sum from "../math/sum";
export default function sequence(load, progress) {
    let totalProgress = Array(load.length).fill(0);
    let result = [];
    let prom = new Promise(load.shift());
    load.forEach((loadItem, index) => {
        prom = prom.then(item => {
            result.push(item);
            totalProgress[index] = 1;
            progress(sum.apply(null, totalProgress) / load.length);
            return new Promise(loadItem);
        });
    });
    return prom.then(item => {
        result.push(item);
        return result;
    });
}
