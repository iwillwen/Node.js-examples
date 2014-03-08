/**
 * 简易多進程 Web 服务器示例 - 2
 */

var net     = require('net');
var http    = require('http');
var cluster = require('cluster');
var util    = require('util');
var os      = require('os');
var numCPUs = os.cpus().length;

var publicPort = parseInt(process.argv[2]) || 8080;

if (cluster.isMaster) {
  // 创建工作进程
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  var wires = Object.keys(cluster.workers).slice();

  // 创建主服务器对象
  var publicServer = net.createServer(function(socket) {
    // 轮循工作进程
    var wire = wires.shift();
    wires.push(wire);

    // 向工作进程传递 Socket
    cluster.workers[wire].send('socket', socket);
  });
  publicServer.listen(publicPort, function() {
    console.log('Listening on http://localhost:%d', publicPort);
  });
} else if (cluster.isWorker) {
  // 工作进程中的 HTTP 服务器
  var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('Hello World!\n');
  });

  // 响应父进程的消息传递
  process.on('message', function(msg, socket) {
    server.emit('connection', socket);
  });
}