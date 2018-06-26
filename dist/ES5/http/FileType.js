"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileType;
(function (FileType) {
    FileType[FileType["UNKNOWN"] = -1] = "UNKNOWN";
    FileType[FileType["IMAGE"] = 0] = "IMAGE";
    FileType[FileType["AUDIO"] = 1] = "AUDIO";
})(FileType || (FileType = {}));
exports.default = FileType;
