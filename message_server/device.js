var uuid = require('node-uuid');

var idCounter = 0;

function Device(ws) {
  this.ws = ws;
  this.id = ++idCounter;
}

Device.prototype.greet = function() {
  var that = this;
  var msgObj = {
    command :"hello_ack",
    payload: {
      id: that.id
    }
  };
  this.sendObj(msgObj);
}

Device.prototype.send = function(msg) {
  this.ws.send(msg);
}

Device.prototype.sendObj = function(obj) {
  var msg = JSON.stringify(obj);
  this.send(msg);
}

module.exports = Device;
