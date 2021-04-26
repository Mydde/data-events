'use strict'

const eventEmitter  = require ('../eventBridge');
const allowedRoutes = require ('../config/allowedRoutes.json');

const httpRoutes = (data, path) => {
	
	
	if(!Object.keys (allowedRoutes).includes(path)){
		throw new Error (`httpRoutes:ROUTE_NOT_ALLOWED ${path}` );
	}
	
	eventEmitter.emit (path, { payload : data, fromPath : path });
}

module.exports = httpRoutes
