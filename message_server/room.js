
function Room() {
  this.devices = [];
}

Room.prototype.join = function (device) {
  var that = this;
  this.devices.push(device);
  console.log("device joined: ", device);
  device.greet();

  device.ws.on('message', function(message) {
    that.onMessage(device, message);
  });

  device.ws.on('close', function() {
    that.leave(device);
  });
}

Room.prototype.leave = function (device) {
  var index = this.devices.indexOf(device);
  if (index > -1) {
    this.devices.splice(index, 1);
    console.log("device left: ", device.id);
  }
}

Room.prototype.list = function () {
  return this.devices;
}

Room.prototype.onMessage = function (sender, message) {
  console.log('received: %s', message);
  this.broadcast(sender, message);
}

Room.prototype.broadcast = function (sender, message) {
  // console.log('received: %s', message);
  var msgObj = {
    msg: message,
    origin: sender.id
  }
  var msg = JSON.stringify(msgObj);
  this.devices.forEach(function(device) {
    if (device != sender) {
      device.ws.send(msg);
    }
  })
}


module.exports = Room;
