/**
 * Web Server - Begining
 *
 * 分流靜態文件
 */

var http = require('http');
var url  = require('url');
var fs   = require('fs');

var server = http.createServer(function(req, res) {
  var filename = url.parse(req.url, true).pathname.substr(1);

  // 檢查文件是否存在
  fs.exists(filename, function(exists) {
    if (exists) {
      return sendFile(filename, res)
    } else {
      return router(req, res);
    }
  });
});

function sendFile(filename, res) {
  fs.stat(filename, function(err, stat) {
    if (err) {
      res.writeHead(503);
      return res.end(err.message);
    }

    if (stat.isFile()) {
      // 創建讀取流，並與響應器相接
      res.writeHead(200);
      fs.createReadStream(filename).pipe(res);
    } else {
      // 指定路徑非文件
      res.writeHead(404);
      res.end('Sorry, it is not a file.\n');
    }
  });
}

// 簡易路由
function router(req, res) {
  var requestInfo = url.parse(req.url, true);
  var pathname = requestInfo.pathname;
  req.query = requestInfo.query;

  // 路由表
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
}

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});