/**
 * Web Server - Begining
 *
 * 使用 GZip 壓縮文件
 */

var http = require('http');
var url  = require('url');
var fs   = require('fs');
var path = require('path');
var zlib = require('zlib');

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
          res.statusCode = 200;
          var source = fs.createReadStream(filename);
          source.pause(); // 暫停讀取流

          // 檢測是否可以進行壓縮
          var ext = path.extname(filename) || '';
          if (ext.match(/json|txt|css|html|js|less|scss|sass|coffee/)) {
            // 修改響應頭
            res.setHeader('Vary', 'Accept-Encoding');
            res.setHeader('Content-Encoding', 'gzip');
            res.removeHeader('Content-Length');

            source.pipe(zlib.createGzip()).pipe(res);
          } else {
            source.pipe(res);
          }

          // 恢復讀取流
          source.resume();
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