var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8081');

var list = {command: "list_users"};
var lightsOn = {command: "lights_on"};
var lightsOff = {command: "lights_off"};

function send(command) {
  var msg = JSON.stringify(command);
  ws.send(msg);
}

ws.on('open', function() {
  // send(list);
  // send(lightsOn);
  send(lightsOff);
});

ws.on('message', function(data, flags) {
  console.log("msg: ", data);
});
