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
  var msg = JSON.stringify(msgObj);
  this.ws.send(msg);
}

module.exports = Device;
