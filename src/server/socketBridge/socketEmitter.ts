'use strict';

import {Socket} from 'socket.io/dist/socket';
import socketIO from 'socket.io';
import {Server} from 'net';

const request        = require('request');
const socketThrottle = require('./socketThrottle');
const {_config}      = require('../../config/config');

class socketEmitterInstance {
  io: any;

  constructor() {

  }

  init(app: Server) {
    //@ts-ignore
    this.io = socketIO(app,);// { origins : 'http://localhost/*' }
    // io.use (this.authorization);
    this.listenConnectionEvents();

    return this.io
  }

  /**
   * first socket client connection authorization middleware
   * @param socket
   * @param next
   */
  authorization(socket: Socket, next: any) {
    // socket.handshake
    this.debug({handshake: socket.handshake})
    // post to api for json_token
    request.post(_config.urlTokenVerify, (err: any, res: any, body: any) => {

      console.log('body authorization from api', err, body);
      /*	if ( err ) {
       return next (new Error (err));
       }*/
      return next();
    });

  }

  /**
   * init onConnection event listener
   */
  listenConnectionEvents() {
    this.debug('listenConnectionEvents')
    this.io.on('connection', (socket: Socket) => {
      this.debug('socket connected')

      this.useMiddleWare(socket)
      this.listenLifeEvents(socket)
      this.listenAuth(socket);

    })
  }

  useMiddleWare(socket: Socket) {
    socket.use((packet, next) => {
      // this.debug('packet', packet)
      /*if (packet.token === true) return next();
       next(new Error('socketEmitterInstance token error'));*/
      return next();
    });
  }

  /**
   *
   * @param socket socketIoObject
   */
  listenAuth(socket: Socket) {

    socket.on('grantIn', (data, fn) => {

      this.debug('grantIn', data, fn);
      if (data.ROLE) {
        socket.join(data.ROLE);
      }
      if (data.host) {
        socket.join(data.host);
      }

      if (fn) return fn('true');

    });
  }

  /**
   *
   * @param socket socketIoObject
   */
  listenLifeEvents(socket: Socket) {
    socket.on('error', (error) => {
      this.debug('error ', error)
    });
    socket.on('disconnecting', (reason) => {
      this.debug('disconnecting ', reason)
    });
    socket.on('disconnect', (reason) => {
      this.debug('disconnect ', reason)
    });
  }

  /**
   *
   * @param roomRole string
   * @param eventRoute string
   * @param data object
   */
  emitToRole(roomRole: any, eventRoute: any, data: any) {
    // socketThrottle([eventRoute, data]);
    console.log({socketThrottle})
    this.io.to(roomRole).emit(eventRoute, data)
    this.debug('emiting data for route /' + eventRoute)
  }

  emitToOwn(own: any, eventRoute: any, data: any) {
    this.io.emit(eventRoute, data)
    this.debug('emiting own data for route /' + eventRoute)
  }

  debug(...log: any) {
    console.log('socketEmitterInstance: ', ...log)
  }
}

export const socketEmitter = new socketEmitterInstance()
module.exports             = socketEmitter