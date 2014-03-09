/**
 * Web Server - Advanced
 *
 * 發送靜態文件
 */

var http = require('http');
var url  = require('url');
var fs   = require('fs');

var server = http.createServer(function(req, res) {
  var filename = url.parse(req.url, true).pathname.substr(1);

  // 檢查文件是否存在
  fs.exists(filename, function(exists) {
    if (exists) {
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
    } else {
      // 文件不存在
      res.writeHead(404);
      res.end('Sorry, File not found.\n');
    }
  });
});

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});