'use strict'

const allowedRoutes = require ('../config/allowedRoutes.json');
const http          = require ('./httpBridge').http;
const httpHandler   = require ('./httpBridge').httpHandler;
const socketEmitter = require ('./socketBridge').socketEmitter;
const eventEmitter  = require ('./eventBridge');

class dataEvent {
	
	constructor(vars, options) {
		this.options = Object.assign ({}, options || {})
	}
	
	/**
	 *
	 * @param  port integer
	 */
	init(port = null) {
		
		this.port = port || this.port;
		if ( !this.port ) {
			throw new Error ('dataEvent:PORT_MISSING');
		}
		this.app = http.createServer (httpHandler).listen (this.port);
		this.io  = socketEmitter.init (this.app);
		 
		this.debug ('listening on port ' + this.port);
		
		this._eventEmitterListen ();
	}
	
	/**
	 *
	 * @param  port integer
	 */
	setPort(port) {
		this.port = port
	}
	
	close() {
		this.app.close ();
	}
	
	restart() {
		this.close ();
		this.init ();
	}
	
	/**
	 * eventEmitter listen to all routes,
	 * - receive data coming from httpRoutes
	 * - emit data to connected sockets
	 */
	_eventEmitterListen() {
		
		Object.keys (allowedRoutes).map ((eventRoute) => {
			
			this.debug ('now listening for eventRoute : ' + eventRoute);
			
			eventEmitter.on (eventRoute, (data) => {
				if ( !data.payload ) {
					this.debug ('dataEvent:PAYLOAD_MISSING');
					return;
					// throw new Error ('dataEvent:PAYLOAD_MISSING');
				}
				if ( data.payload.roles ) {
					this._eventEmitterDispatch (eventRoute, data);
				}
				else {
					this.debug ('dataEvent:PAYLOAD_ROLE_MISSING');
					return;
					// throw new Error ('dataEvent:PAYLOAD_ROLE_MISSING');
				}
			});
		})
	};
	
	/**
	 *
	 * @param eventRoute string
	 * @param data object < data.payload >
	 * @private
	 */
	_eventEmitterDispatch(eventRoute, data = {}) {
		
		this.debug ('dispatch for ' + eventRoute);
		// own : private request for one socket.id
		if ( data.payload.own ) {
			socketEmitter.emitToOwn (own, eventRoute, data);
		}
		else {
			// send to each room / ROLE
			data.payload.roles.map ((roomRole) => {
				this.debug ('emitting to room', roomRole);
				socketEmitter.emitToRole (roomRole, eventRoute, data);
			})
		}
	}
	
	debug(...log) {
		console.log ('dataEvent :' + this.port, ...log)
	}
	
}

const dataEventInstance = new   dataEvent ();
module.exports            = dataEventInstance;
