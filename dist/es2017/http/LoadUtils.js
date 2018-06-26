import HTTPRequest from "./HTTPRequest";
export function loadImage(src) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.addEventListener('load', () => {
            resolve(img);
        });
        img.addEventListener('error', (e) => {
            reject(e);
        });
        img.src = src;
    });
}
export function loadAudio(src) {
    return HTTPRequest.getArrayBuffer(src);
}
