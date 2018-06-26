"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function sum() {
    var items = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        items[_i] = arguments[_i];
    }
    var result = 0;
    for (var i = 0; i < items.length; i++) {
        result = result + items[i];
    }
    return result;
}
exports.default = sum;
