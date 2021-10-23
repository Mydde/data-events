'use strict'

// relay events between modules

const EvEmitter = require('events').EventEmitter;

const eventBridgeEmitter = new EvEmitter();

export {eventBridgeEmitter}

module.exports = eventBridgeEmitter