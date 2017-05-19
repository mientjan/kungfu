import {Signal2, SignalConnection} from 'seng-signals'

let time = 0;
let raf = -1;
let signals:Array<Signal2<number, number>> = [];
let length = signals.length;
let delta = 0;
let tick = (currTime) => {
	raf = requestAnimationFrame(tick);
	delta = currTime - time;
	time = currTime;

	for (var i = 0; i < length; i++)
	{
		signals[i].emit(time, delta)
	}
}

export default class Raf extends Signal2<number, number> {

	protected static start(){
		if(raf == -1 && length > 0)
		{
			raf = requestAnimationFrame(tick);
		}
	}

	protected static stop(){

		if(raf > -1 && length == 0)
		{
			cancelAnimationFrame(raf);
			raf = -1;
		}
	}

	public connect (listener: Function, prioritize?: boolean): SignalConnection
	{
		if(!this.hasListeners())
		{
			signals.push(this);
			length = signals.length;
		}

		return super.connect(listener, prioritize);
	}

	public disconnect (conn: SignalConnection): void
	{
		super.disconnect(conn);

		if(!this.hasListeners())
		{
			for (var i = 0; i < length; i++)
			{
				if(signals[i] === this)
				{
					signals.splice(i, 1)
				}
			}

			length = signals.length;
		}

	}
}