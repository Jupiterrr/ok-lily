var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var uuid = require('node-uuid');

console.log('websocket server created');

names = [""];


connections = [];

function WsConnection(ws) {
  this.ws = ws;
  this.id = uuid.v4();
}

wss.on('connection', function(ws) {
  var connection = new WsConnection(ws);
  connections.push(connection);
  
  var msgObj = {
    msg: "hello",
    yourID: connection.id
  };
  var msg = JSON.stringify(msgObj);
  ws.send(msg);

  
  ws.on('message', function(message) {
    console.log('received: %s', message);
    broadcast(connection, message);
  });

  ws.on('close', function() {
    console.log('websocket connection close');
    disconnect(connection);
  });
  
});



function broadcast(sender, message) {
  var msgObj = {
    msg: message,
    origin: sender.id
  }
  var msg = JSON.stringify(msgObj);
  connections.forEach(function(connection) {
    if (connection != sender) {
      connection.ws.send(msg);
    }
  })
}

function disconnect(ws) {
  var index = connections.indexOf(ws);
  if (index > -1) {
    connections.splice(index, 1);
    console.log("disconnect")
  }
}

