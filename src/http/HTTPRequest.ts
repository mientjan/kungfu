

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

/**
 * @class HTTPRequest
 */
export default class HTTPRequest<T>
{
	/**
	 * @static
	 * @method request
	 * @param {string} method
	 * @param {string} url
	 * @param {Array<string>} args
	 * @returns {Promise}
	 */
	private static request(method:string, url:string, data:string|Object|ArrayBuffer|Blob|FormData = null, options:IHTTPRequestOptions = {}):Promise<any>
	{
		// Creating a promise
		return new Promise(function(resolve:Function, reject:Function) {

			// Instantiates the XMLHttpRequest
			let client = new XMLHttpRequest();
			let uri = url;

			if(options.responseType)
			{
				client.responseType = options.responseType;
			}

			if(options.responseType == 'document' && client.overrideMimeType)
			{
				client.overrideMimeType('text/xml');
			}

			client.open(method, uri);

			if(data)
			{
				client.send(data);
			} else {
				client.send();
			}

			client.onload = function ()
			{
				if ( (this['status'] >= 200 && this['status'] < 400) || this['status'] === 0)
				{
					if(client.responseType == 'document')
					{
						resolve(this['responseXML']);
					} else {
						// Performs the function "resolve" when this.status is equal to 200
						resolve(this['response'] || this['responseText']);
					}
				} else {
					// Performs the function "reject" when this.status is different than 200
					reject(this['statusText']);
				}
			};

			client.onerror = function () {
				reject(this['statusText']);
			};
		});
	}

	/**
	 *
	 * @param {string} url
	 * @param {IHashMap<any>} query
	 * @returns {Promise<string>}
	 */
	public static getString<T>(url:string):Promise<T>
	{
		return HTTPRequest.request('GET', url, {}, {responseType:"text"});
	}

	/**
	 *
	 * @param {string} url
	 * @param {IHashMap<any>} query
	 * @returns {Promise}
	 */
	public static getJSON(url:string):Promise<any>
	{
		return HTTPRequest.getString(url)
			.then((response:string) => JSON.parse(response));
	}

	public static getArrayBuffer(url:string):Promise<ArrayBuffer>
	{
		return HTTPRequest.request('GET', url, null, {responseType:"arraybuffer"});
	}

	public static getXML(url:string):Promise<Document>
	{
		return HTTPRequest.request('GET', url, null, {responseType:"document"});
	}
}

export enum Type {
	JSON,
	STRING
}
