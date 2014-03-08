/**
 * 简易多线程 Web 服务器示例 - 1
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
} else if (cluster.isWorker) {
  // 工作进程中的 HTTP 服务器
  var server = http.createServer(function(req, res) {
    res.writeHead(200, {
      Connection: 'close'
    });
    res.end(util.format('Worker %s saying: Hello World!\n', process.pid));
  });

  server.listen(publicPort, function() {
    console.log('Listening on http://localhost:%d', publicPort);
  });
}