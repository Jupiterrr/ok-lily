var commands = require('./commands');


function Room() {
  this.devices = [];
}

Room.prototype.join = function (device) {
  var that = this;
  this.devices.push(device);
  console.log("device joined: ", device.id);
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
  try {
    var rq = JSON.parse(message);
    commands.exec(this, sender, rq);
  } catch (e) {
    console.log("error: ", e);
  }
  
}

Room.prototype.broadcast = function (sender, messageObj) {
  var msg = JSON.stringify(messageObj);
  console.log('broadcast: %s', msg);
  this.devices.forEach(function(device) {
    if (device != sender) {
      device.send(msg);
    }
  })
}


module.exports = Room;
