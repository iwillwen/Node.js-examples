/**
 * Web Server - Advanced
 *
 * 基礎路由
 */

var http = require('http');
var url  = require('url');
var util = require('util');

var server = http.createServer(function(req, res) {
  var requestInfo = url.parse(req.url, true);
  var pathname = requestInfo.pathname;
  req.query = requestInfo.query;

  switch (pathname) {
    case '/':
      res.writeHead(200);
      res.end('This is index page.\n');
      break;
    case '/hello':
      res.writeHead(200);
      res.end('Hey.\n');
      break;
    case '/echo':
      res.writeHead(200);
      res.end(util.format('You said: %s\n', req.query.msg || 'nothing'));
      break;
    default:
      res.writeHead(404);
      res.end('Sorry, Page not found.\n');
  }
});

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});