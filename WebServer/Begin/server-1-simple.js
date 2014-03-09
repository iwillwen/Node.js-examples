/**
 * Web Server - Advanced
 *
 * 基礎
 */

var http = require('http');

// 響應器
var server = http.createServer(function(req, res) {
  // 響應狀態、頭
  res.writeHead(200);
  // 響應正文
  res.end('Hello World\n');
});

// 端口監聽
server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});