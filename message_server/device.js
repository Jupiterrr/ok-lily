var uuid = require('node-uuid');

function Device(ws) {
  this.ws = ws;
  this.id = uuid.v4();
}

Device.prototype.greet = function() {
  var that = this;
  var msgObj = {
    msg: "hello",
    yourID: that.id
  };
  var msg = JSON.stringify(msgObj);
  this.ws.send(msg);
}

module.exports = Device;
