/**
 * Web Server - Professional
 *
 * REST 路由
 */

var http = require('http');
var url  = require('url');
var util = require('util');

// 高階路由
var router = {
  watching: [],
  __base: '',

  // 運行路由
  run: function(url, req, res) {
    for (var i = 0; i < router.watching.length; i++) {
      if (router.watching[i].regexp.exec(url)) {
        // 命中路由
        
        req.params = router.parseParams(url, router.watching[i]);
        return router.watching[i].handler(req, res);
      }
    }
  },

  // 路由前綴
  base: function(base) {
    if (arguments.length == 0) {
      return this.__base;
    }

    this.__base = base;

    return this;
  },

  // 增加路由規則
  add: function(_path, handler) {
    if ('*' !== _path && 0 != _path.indexOf(this.base())) {
      _path = this.base() + (path == '/' ? '' : path);
    }

    var rule = router.parseRule(_path);
    if (handler instanceof String) {
      var target = handler;
      handler = function(req, res) {
        router.run('/' + target, req, res);
      };
    }
    rule.handler = handler;

    router.watching.push(rule);

    return router;
  },

  // 解析路由規則
  parseRule: function(rule) {
    if (rule instanceof RegExp) {
      return {
        keys: [],
        regexp: rule
      };
    }

    if (rule instanceof Array) {
      rule = '(' + rule.join('|') + ')';
    }

    var rtn = {
      keys: [],
      regexp: null
    };

    rtn.regexp = new RegExp(
      rule
        .replace(/([\/\()+]):/g, '(?:')
        .replace(/\(\?:(\w+)/g, function(_, key) {
          rtn.keys.push(key);
          return '(?:\/?([^\/]+)?)';
        })
        .replace('))', ')')
        .replace(/\*/g, '(.*)') + '((#.+)?)$'
    , 'i');

    return rtn;
  },

  // 解析 REST 參數
  parseParams: function(url, rule) {
    var matches = rule.regexp.exec(url).slice(1);
    var keys = rule.keys;
    var params = {};

    for (var i = 0; i < keys.length; i++) {
      params[keys[i]] = matches[i];
    }

    return params;
  }
};

// 路由表
router
  // .base('/prefix')
  .add('/', function(req, res) {
    res.writeHead(200);
    res.end('This is the index page.\n');
  })
  .add('/hello', function(req, res) {
    res.writeHead(200);
    res.end('Hey!\n');
  })
  .add('/echo/:msg', function(req, res) {
    res.writeHead(200);
    res.end(util.format('You said: %s\n', req.params.msg));
  });

var server = http.createServer(function(req, res) {
  return router.run(req.url, req, res);
});

server.listen(8080, function() {
  console.log('Web Server was bound on http://localhost:8080');
});