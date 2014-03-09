/**
 * Web Server - Advanced
 *
 * 請求參數
 */

var http = require('http');
var url  = require('url');

var server = http.createServer(function(req, res) {
  var query = url.parse(req.url, true).query;

  res.writeHead(200);
  res.end(query.message + '\n' || 'Hello World\n');
});

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});