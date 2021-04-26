"use strict";

const parseArgs = require("minimist");
const argv = parseArgs(process.argv);

const socketEvent = require("./src/server/dataEvents.js");

function start() {
  socketEvent.setPort(argv.port || 4000);
  socketEvent.init();
}
 
console.log(argv['_']);

if(argv['start']){
    start()
}

module.exports = start;
