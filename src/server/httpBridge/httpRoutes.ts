'use strict'

const allowedRoutes = require ('../../config/allowedRoutes.json');
const {eventBridgeEmitter} = require("../eventBridgeEmitter");

export const httpRoutes = (data:any, path:string) => {
	
	
	if(!Object.keys (allowedRoutes).includes(path)){
		// throw new Error (`httpRoutes:ROUTE_NOT_ALLOWED ${path}` );
		console.error( (`httpRoutes:ROUTE_NOT_ALLOWED ${path}` ));
		return new Error (`httpRoutes:ROUTE_NOT_ALLOWED ${path}` );
	}

	eventBridgeEmitter.emit (path, { payload : data, fromPath : path });
}

module.exports = httpRoutes
