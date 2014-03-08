/**
 * 简易多進程 Web 服务器示例 - 3
 */

// Master
var net          = require('net');
var http         = require('http');
var cluster      = require('cluster');
var util         = require('util');
var os           = require('os');
var fs           = require('fs');
var path         = require('path');
var fork         = require('child_process').fork;
var EventEmitter = require('events').EventEmitter;
var numCPUs      = os.cpus().length;

function Master() {
  if (!(this instanceof Master)) return new Master();

  this.childs = {};
}
Master.create = Master;
util.inherits(Master, EventEmitter);

Master.prototype.register = function(name, filepath, options) {
  this.childs[name] = new Child(this, name, filepath, options);

  return this;
};
Master.prototype.run = function(callback) {
  var self = this;

  var n = Object.keys(this.childs).length;

  Object.keys(this.childs).forEach(function(name) {
    self.childs[name].run(function() {
      --n || callback();
    });
  });

  process.on('exit', function() {
    self.childs[name].send('exit');
  });

  return this;
};

function Child(parent, name, filepath, options) {
  this.name = name;
  this.filepath = filepath;
  this.options = options;
  this.workers = {};
  this.pids = [];

  this.parent = function() {
    return parent;
  };
}
util.inherits(Child, EventEmitter);

Child.prototype.run = function(callback) {
  var self = this;

  var childServer = net.createServer(function(socket) {
    var currPID = self.pids.shift();
    self.pids.push(currPID);

    self.workers[currPID].send({
      name: self.name
    }, socket);
  });
  childServer.listen(self.options.port, self.options.host || '0.0.0.0', callback);

  self.server = childServer;

  if (self.options.children) {
    for (var i = 0; i < self.options.children; i++) {
      self.fork();
    }

    return self;
  } else {
    return self.fullyFork();
  }
};
Child.prototype.fork = function() {
  var self = this;

  var file = path.resolve(process.cwd(), this.filepath);

  if (fs.existsSync(file)) {
    var sub = fork(
      file, [],
      {
        env: process.env,
        stdio: 'pipe'
      });

    var pid = sub.pid;
    sub.on('close', function() {
      delete self.workers[pid];
      self.pids.splice(self.pids.indexOf(pid), 1);

      self.fork();
    });
    this.pids.push(pid);
    this.workers[pid] = sub;

    return sub;
  } else {
    throw new Error('file notfound.');
  }
};
Child.prototype.fullyFork = function() {
  for (var i = 0; i < numCPUs; i++) {
    this.fork();
  }

  return this;
};

module.exports = Master;