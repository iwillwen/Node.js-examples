// Worker
var net = require('net');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Worker(callback) {
  if (!(this instanceof Worker)) return new Worker(callback);

  var self = this;

  self.on('socket', callback || noop);

  process.on('message', function(msg, socket) {
    if (msg.name) {
      self.name = msg.name;
      self.emit('socket', socket);
    }

    if (msg == 'exit') {
      process.exit(1);
    }
  })
}
Worker.create = Worker;
util.inherits(Worker, EventEmitter);

Worker.prototype.pose = function(callback) {
  this.on('socket', callback);

  return this;
};

function noop() {
  return false;
}

module.exports = Worker;