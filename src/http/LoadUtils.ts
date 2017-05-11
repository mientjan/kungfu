import HTTPRequest from "./HTTPRequest";
export function loadImage(src:string):Promise<HTMLImageElement>
{
	return new Promise((resolve, reject) => {
		let img = document.createElement('img');
		img.addEventListener('load', () => {
			resolve(img);
		})

		img.addEventListener('error', (e) => {
			reject(e);
		});

		img.src = src;
	})
}

export function loadAudio(src:string):Promise<ArrayBuffer>
{
	return HTTPRequest.getArrayBuffer(src);
}
