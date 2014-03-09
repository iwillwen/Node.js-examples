/**
 * Web Server - Begining
 *
 * 基礎路由
 */

var http = require('http');
var url  = require('url');
var util = require('util');

var server = http.createServer(function(req, res) {
  switch (req.method.toLowerCase()) {
    case 'get':
      res.writeHead(200);
      res.end('You got a page.\n');
      break;
    case 'post':
      res.writeHead(200);
      res.end('You post some data.\n');
      break;
    case 'put':
      res.writeHead(200);
      res.end('You put something new to the server.\n');
      break;
    case 'delete':
      res.writeHead(200);
      res.end('You want to remove something.\n');
      break;
    case 'head':
      res.writeHead(200, req.headers);
      res.end();
      break;
    default:
      res.writeHead(404);
      res.end('Unsupport this HTTP method.\n');
  }
});

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});