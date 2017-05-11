import {Signal1, SignalConnection} from 'seng-signals'

export default class Raf {

	private static _signal = new Signal1<number>();
	private static _raf = -1;
	private static tick = (time) => {
		Raf._raf = requestAnimationFrame(Raf.tick);
		Raf._signal.emit(time);
	}

	protected _connections:Array<SignalConnection> = [];

	connect(fn:any):SignalConnection
	{
		let connection = Raf._signal.connect(fn);
		this._connections.push(connection);

		let dispose = connection.dispose;
		connection.dispose = () => {
			dispose.call(connection);
			this.stop();
		}

		this.start();

		return connection;
	}

	public disconnectAll()
	{
		while(this._connections.length)
		{
			this._connections.pop().dispose();
		}
	}

	protected start(){
		if(Raf._raf == -1 && Raf._signal.hasListeners())
		{
			Raf._raf = requestAnimationFrame(Raf.tick);
		}
	}

	protected stop(){

		if(Raf._raf > -1 && !Raf._signal.hasListeners())
		{
			cancelAnimationFrame(Raf._raf);
			Raf._raf = -1;
		}
	}

	public destruct():void
	{
		this.disconnectAll();

		if(Raf._raf > -1 && !Raf._signal.hasListeners())
		{
			this.stop();
		}
	}

}