// 主進程
var Master = require('./lib/master');

// 創建 Master
var master = Master.create();

// 部署 Worker
var http1 = master.register('http1', './worker.js', {
  port: parseInt(process.argv[2] || 8080),
  children: 4
});
var http2 = master.register('http2', './worker.js', {
  port: parseInt(process.argv[2] || 8081)
});

// 運行 Master
master.run(function() {
  console.log('server bound');
});