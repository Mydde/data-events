"use strict";

const url = require('url');
const httpRoutes = require('./httpRoutes')

type Treq = {
	url: string; 
	connection: { destroy: () => void; };
	headers: any;
}

type Tres = { writeHead: (arg0: number, arg1: { "Content-Type": string; }) => void; end: () => void; }

/**
 * handle http events
 *
 * @param req
 * @param res
 */
export function httpHandler(req: any, res: any) {

	if (!req.url) return;
	if (req.url === '/favicon.ico') {
		res.writeHead(200, { 'Content-Type': 'image/x-icon' });
		res.end();
		return;
	}
	let path = url.parse(req.url).pathname;
	let fullBody = '';



	req.on('data', function (chunk: any) {
		fullBody += chunk.toString();
		if (fullBody.length > 1e6) {
			req.connection.destroy();
		}
	});

	req.on('end', function () {
		let data = null
		try {
			data = JSON.parse(fullBody);
		} catch (e) {
			debug("data is not JSON");
		}

		res.writeHead(200, { 'Content-Type': 'text/html' })
		res.end();
console.log(data)
		// debug(data, path);
		httpRoutes(data, path);
	});

	const debug = (...log: any) => {
		console.log('httpHandler : ', { ...log })
	}

	// debug(req.headers)
}

module.exports = httpHandler
