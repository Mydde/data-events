const socketIO = require ('socket.io');

const socketInstance = {
	_instance: null,
	get instance () {
		if (!this._instance) {
			this._instance = socketIO;
		}
		return this._instance;
	}
}