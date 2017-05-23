export default function sum(...items:Array<number>):number
{
	let result = 0;
	for (var i = 0; i < items.length; i++)
	{
		result = result + items[i];
	}

	return result;
}