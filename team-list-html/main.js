var connection = new WebSocket('ws://localhost:8080');
var readyState = false;

connection.onopen = function () {
  console.log("WebSocket connected");
};

// Log errors
connection.onerror = function (error) {
  console.log('WebSocket Error ', error);
};

// Log messages from the server
connection.onmessage = function (e) {
  console.log('Server: ', e.data);
  var obj = JSON.parse(e.data);

  if (obj.command == "all_available") {
    ready();
  }
};

connection.onclose = function () {
  console.log("WebSocket closed");
  // connection.send('Ping'); // Send the message 'Ping' to the server
};


function ready() {
  if (readyState) return;
  readyState = true;
  document.body.classList.add("ready");
  send({
    command: "lights_blink"
  });
  window.setTimeout(function() {
    send({
      command: "start presi",
      targetID: "beamer"
    });
  }, 4000);
}

function send(msgObj) {
  var msg = JSON.stringify(msgObj);
  console.log("send: ", msg);
  connection.send(msg)
}