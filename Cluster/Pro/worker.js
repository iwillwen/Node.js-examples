// 工作進程
var Worker = require('./lib/worker');
var http = require('http');
var util = require('util');

// HTTP 服務器
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end(util.format('Worker %s - %s: Hello World!\n', worker.name, process.pid));
});

// 接收請求
var worker = Worker.create(function(socket) {
  server.emit('connection', socket);
});