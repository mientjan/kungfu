export function timeout(time:number):Promise<void>
{
	return new Promise((resolve:(result:void) => any, reject) => {
		setTimeout(() => resolve(void 0), time);
	})
}