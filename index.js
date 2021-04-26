'use strict'

const parseArgs = require ('minimist')
const argv      = parseArgs (process.argv)

const socketEvent = require ('./src/socketEvent.js');

socketEvent.setPort (argv.p || 3005);
socketEvent.init ();
