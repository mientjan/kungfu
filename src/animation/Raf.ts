import {Signal1, SignalConnection} from 'seng-signals'

export default class Raf {

	private static _signal = new Signal1<number>();
	private static _raf = -1;

	private static tick = (time) => {
		Raf._raf = requestAnimationFrame(Raf.tick);
		Raf._signal.emit(time);
	}

	protected static _connections:Array<SignalConnection> = [];

	public static connect(fn:any):SignalConnection
	{
		let connection = Raf._signal.connect(fn);
		this._connections.push(connection);

		let dispose = connection.dispose;
		connection.dispose = () => {
			dispose.call(connection);
			Raf.stop();
		}

		Raf.start();

		return connection;
	}

	protected static start(){
		if(Raf._raf == -1 && Raf._signal.hasListeners())
		{
			Raf._raf = requestAnimationFrame(Raf.tick);
		}
	}

	protected static stop(){

		if(Raf._raf > -1 && !Raf._signal.hasListeners())
		{
			cancelAnimationFrame(Raf._raf);
			Raf._raf = -1;
		}
	}

	protected static destruct():void
	{
		this.disconnectAll();

		if(Raf._raf > -1 && !Raf._signal.hasListeners())
		{
			this.stop();
		}
	}

}