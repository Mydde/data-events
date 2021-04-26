'use strict'

const socketEmitter  = require ('./socketEmitter');
const socketThrottle = require ('./socketThrottle');
const socketRoom     = require ('./socketRoom');

module.exports = {
	socketEmitter,
	socketRoom,
	socketThrottle
}
