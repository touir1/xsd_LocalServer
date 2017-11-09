var http = require("http");
var url = require("url");
var fs = require('fs');
var log4js = require('log4js');
log4js.configure({
  appenders: { 
	logs: { type: 'file', filename: 'logs.log' },
	console: { type: 'console' }
	},
  categories: { default: { appenders: ['logs','console'], level: 'info' } }
});
const logger = log4js.getLogger('logs');
//var logger = log4js.getLogger();
logger.level = 'info';

var port = 8888;

if(process.argv.length>2){
	if(process.argv.length==3){
		try{
		port = parseInt(process.argv[2]);
		}
		catch(e){
			//console.log('invalid port number');
			logger.error('invalid port number. exiting...');
			process.exit();
		}
	}
}

function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
	if(pathname!="/favicon.ico" && pathname.indexOf("..") == -1 && pathname.indexOf("/scheme/")!=-1){
		//console.log("Request for " + pathname + " received.");
		logger.info("Request for " + pathname + " received.");
		try{
			var fileContent = fs.readFileSync('.'+pathname);
			response.writeHead(200, {"Content-Type": "text/xml"});
			response.end(fileContent, 'binary');
			logger.info('scheme file sent successfully.');
		}
		catch(e){
			//console.log("error while accessing requested file");
			logger.error('error while accessing requested file');
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not found");
			response.end();
		}
	}
	else if(pathname=="/favicon.ico"){
		logger.info("Request for " + pathname + " received.");
		try{
			var fileContent = fs.readFileSync('.'+pathname);
			response.writeHead(200, {"Content-Type": "image/x-icon"});
			response.end(fileContent, 'binary');
			logger.info('favicon sent successfully.');
		}
		catch(e){
			//console.log("error while accessing requested file");
			logger.warn('favicon.ico not found');
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not found");
			response.end();
		}
	}
	else{
		logger.error("Request for " + pathname + " received.");
		logger.error('access denied');
		response.writeHead(404, {"Content-Type": "text/plain"});
		response.write("404 Not found");
		response.end();
	}
}

http.createServer(onRequest).listen(port);
//console.log("Server has started on port "+port+".");
logger.info("Server has started on port "+port+".");