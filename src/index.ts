"use strict";

import { _config } from "./config/config";
import { socketDataEvent } from "./server/dataEvents";

const parseArgs = require("minimist");
const argv = parseArgs(process.argv);  

const defaultPort = argv?.port ?? _config.defaultPort;

export function start(port:number) {
  socketDataEvent.setPort(port);
  socketDataEvent.init();

  return socketDataEvent;
}

start(defaultPort)

// start with ts-node :
// node.exe -r ts-node/register ./src --start --port 6000
// tsc --build --verbose --incremental --watch & node.exe -r ts-node/register ./src --port 4000
