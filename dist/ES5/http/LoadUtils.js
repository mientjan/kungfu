"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HTTPRequest_1 = require("./HTTPRequest");
function loadImage(src) {
    return new Promise(function (resolve, reject) {
        var img = document.createElement('img');
        img.addEventListener('load', function () {
            resolve(img);
        });
        img.addEventListener('error', function (e) {
            reject(e);
        });
        img.src = src;
    });
}
exports.loadImage = loadImage;
function loadAudio(src) {
    return HTTPRequest_1.default.getArrayBuffer(src);
}
exports.loadAudio = loadAudio;
