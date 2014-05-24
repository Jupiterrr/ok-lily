var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});

var Room = require('./room');
var room = new Room();
var Device = require('./device');

console.log('websocket server created');

wss.on('connection', function(ws) {
  var device = new Device(ws);
  room.join(device);
});
