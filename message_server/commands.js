var Bridge = require('../lights/bridge');
var lights;

Bridge.connect(function(lights_local) {
  lights = lights_local;
})

var commands = {
  "list_users": 
    function(room, sender, messageObj) {
      var msgObj = {
        command: "list_users",
        payload: {
          participants : room.list()
        }
      }
      sender.sendObj(msgObj);
    },

  "lights_on": 
    function(room, sender, messageObj) {
      if (lights) lights.on();
    },
  
  "lights_off":
    function lightsOffCommand(room, sender, messageObj) {
      if (lights) lights.off();
    },

  "lights_alert":
    function lightsOffCommand(room, sender, messageObj) {
      if (lights) lights.alert();
    },

  "lights_blink":
    function lightsOffCommand(room, sender, messageObj) {
      if (lights) lights.blink();
    },

  "default":
    function(room, sender, messageObj) {
      room.broadcast(sender, messageObj);
    }

};


module.exports.exec = function(room, sender, rq) {
  var command = (rq.command in commands) ? commands[rq.command] : commands["default"];
  command(room, sender, rq);
}
