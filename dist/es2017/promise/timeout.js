export function timeout(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(void 0), time);
    });
}
