"use strict";
/*
 * HTTPRequest
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Mient-jan Stelling
 * Copyright (c) 2015 MediaMonks B.V
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above * copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @class HTTPRequest
 */
var HTTPRequest = /** @class */ (function () {
    function HTTPRequest() {
    }
    /**
     * @static
     * @method request
     * @param {string} method
     * @param {string} url
     * @param {Array<string>} args
     * @returns {Promise}
     */
    HTTPRequest.request = function (method, url, data, options) {
        if (data === void 0) { data = null; }
        if (options === void 0) { options = {}; }
        // Creating a promise
        return new Promise(function (resolve, reject) {
            // Instantiates the XMLHttpRequest
            var client = new XMLHttpRequest();
            var uri = url;
            if (options.responseType) {
                client.responseType = options.responseType;
            }
            if (options.responseType == 'document' && client.overrideMimeType) {
                client.overrideMimeType('text/xml');
            }
            client.open(method, uri);
            if (data) {
                client.send(data);
            }
            else {
                client.send();
            }
            client.onload = function () {
                if ((this['status'] >= 200 && this['status'] < 400) || this['status'] === 0) {
                    if (client.responseType == 'document') {
                        resolve(this['responseXML']);
                    }
                    else {
                        // Performs the function "resolve" when this.status is equal to 200
                        resolve(this['response'] || this['responseText']);
                    }
                }
                else {
                    // Performs the function "reject" when this.status is different than 200
                    reject(this['statusText']);
                }
            };
            client.onerror = function () {
                reject(this['statusText']);
            };
        });
    };
    /**
     *
     * @param {string} url
     * @param {IHashMap<any>} query
     * @returns {Promise<string>}
     */
    HTTPRequest.getString = function (url) {
        return HTTPRequest.request('GET', url, {}, { responseType: "text" });
    };
    /**
     *
     * @param {string} url
     * @param {IHashMap<any>} query
     * @returns {Promise}
     */
    HTTPRequest.getJSON = function (url) {
        return HTTPRequest.getString(url)
            .then(function (response) { return JSON.parse(response); });
    };
    HTTPRequest.getArrayBuffer = function (url) {
        return HTTPRequest.request('GET', url, null, { responseType: "arraybuffer" });
    };
    HTTPRequest.getXML = function (url) {
        return HTTPRequest.request('GET', url, null, { responseType: "document" });
    };
    return HTTPRequest;
}());
exports.default = HTTPRequest;
var Type;
(function (Type) {
    Type[Type["JSON"] = 0] = "JSON";
    Type[Type["STRING"] = 1] = "STRING";
})(Type = exports.Type || (exports.Type = {}));
