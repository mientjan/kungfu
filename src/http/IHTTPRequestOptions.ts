interface IHTTPRequestOptions
{
	/**
	 * json not supported in IE
	 */
	responseType?:'arraybuffer'|'blob'|'document'|'json'|'text';
}
