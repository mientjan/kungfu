import sum from "../math/sum";
export default function all(load, progress) {
    let totalProgress = Array(load.length).fill(0);
    let list = load.map((val, index) => {
        let method = data => {
            totalProgress[index] = 1;
            progress(sum.apply(null, totalProgress) / load.length);
            return data;
        };
        return val.then(method);
    });
    return Promise.all(list);
}
