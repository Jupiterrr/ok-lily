var Bridge = require('../lights/bridge');
var lights;

Bridge.connect(function(lights_local) {
  lights = lights_local;
})

function listCommand(room, sender, messageObj) {
  var ids = room.list().map(function(device) { return device.id; });
  var msgObj = {
    command: "list_users",
    payload: {
      participants : ids
    }
  }
  sender.sendObj(msgObj);
}

function defaultCommand(room, sender, messageObj) {
  room.broadcast(sender, messageObj);
}

function lightsOnCommand(room, sender, messageObj) {
  if (lights) lights.on();
}

function lightsOffCommand(room, sender, messageObj) {
  if (lights) lights.off();
}

module.exports = {
  listCommand: listCommand,
  defaultCommand: defaultCommand,
  lightsOnCommand: lightsOnCommand,
  lightsOffCommand: lightsOffCommand
};
