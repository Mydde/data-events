"use strict";

const config         = require ('../../config/config');
const request        = require ('request');
const socketIO       = require ('socket.io');
const socketThrottle = require ('./socketThrottle');

class socketEmitter {
	
	constructor(vars, options) {
	
	}
	
	init(app) {
		this.io = socketIO (app,);// { origins : 'http://localhost/*' }
		// io.use (this.authorization);
		this.listenConnectionEvents ();
		
		return this.io
	}
	
	/**
	 * first socket client connection authorization middleware
	 * @param socket
	 * @param next
	 */
	authorization(socket, next) {
		// socket.handshake
		this.debug ({ handshake : socket.handshake })
		// post to api for json_token
		request.post (config.url_token, (err, res, body) => {
			
			console.log ('body authorization from api', err, body);
			/*	if ( err ) {
			 return next (new Error (err));
			 }*/
			return next ();
		});
		
	}
	
	/**
	 * init onConnection event listener
	 */
	listenConnectionEvents() {
		this.debug('listenConnectionEvents')
		this.io.on ('connection', (socket) => {
			this.debug ('socket connected')
			
			this.useMiddleWare (socket)
			this.listenLifeEvents (socket)
			this.listenAuth (socket);
			
		})
	}
	
	useMiddleWare(socket) {
		socket.use ((packet, next) => {
			// this.debug('packet', packet)
			/*if (packet.token === true) return next();
			 next(new Error('socketEmitter token error'));*/
			return next ();
		});
	}
	
	/**
	 *
	 * @param socket socketIoObject
	 */
	listenAuth(socket) {
		
		socket.on ('grantIn', (data, fn) => {
			
			this.debug ('grantIn', data, fn);
			if ( data.ROLE ) {
				socket.join (data.ROLE);
			}
			if ( data.host ) {
				socket.join (data.host);
			}
			
			if ( fn ) return fn ('true');
			
		});
	}
	
	/**
	 *
	 * @param socket socketIoObject
	 */
	listenLifeEvents(socket) {
		socket.on ('error', (error) => {
			this.debug ('error ', error)
		});
		socket.on ('disconnecting', (reason) => {
			this.debug ('disconnecting ', reason)
		});
		socket.on ('disconnect', (reason) => {
			this.debug ('disconnect ', reason)
		});
	}
	
	/**
	 *
	 * @param roomRole string
	 * @param eventRoute string
	 * @param data object
	 */
	emitToRole(roomRole, eventRoute, data) {
		// socketThrottle([eventRoute, data]);
		console.log({socketThrottle})
		this.io.to (roomRole).emit (eventRoute, data)
		this.debug ('emiting data for route /' + eventRoute)
	}
	
	emitToOwn(own, eventRoute, data) {
		this.io.emit (eventRoute, data)
		this.debug ('emiting own data for route /' + eventRoute)
	}
	
	debug(...log) {
		console.log ('socketEmitter: ', ...log)
	}
}

module.exports = new socketEmitter ()
