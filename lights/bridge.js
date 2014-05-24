var hue = require("node-hue-api");
var HueApi = hue.HueApi;
var lightState = hue.lightState;

var username = "1969998bf08b7ef23d92a9338e01577";
var id = "001788fffe14f539"


var displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};

function locate(id, cb) {
  var displayBridges = function(bridges) {
    var selection = bridges.filter(function(bridge) { return bridge.id == id});
    
    if (selection[0]) {
      var bridge = selection[0];
      console.log("Hue Bridge Found: " + JSON.stringify(bridge));
      cb(bridge.ipaddress);
    } else {
      console.log("Hue Bridges Found: " + JSON.stringify(bridges));
      throw "Bridge not found!"
    }
  };

  hue.locateBridges().then(displayBridges).done();
}



function Lights(api) {
  this.api = api;
}

Lights.prototype.test = function() {
  var state = lightState.create().alert(); //rgb(0, 0, 255)
  this.api.setGroupLightState(0, state)
    .then(displayResult)
    .done();
}

Lights.prototype.on = function() {
  var state = lightState.create().white(154).on(); //rgb(0, 0, 255)
  this.api.setGroupLightState(0, state)
    .then(displayResult)
    .done();
}

Lights.prototype.off = function() {
  var state = lightState.create().off();
  this.api.setGroupLightState(0, state)
    .then(displayResult)
    .done();
}

Lights.prototype.alert = function() {
  var state = lightState.create().alert();
  this.api.setGroupLightState(0, state)
    .then(displayResult)
    .done();
}


module.exports.connect = function(cb) {
  locate(id, function(ip) {
    var api = new HueApi(ip, username);
    var lights = new Lights(api);
    cb(lights);
  })
}

// module.exports.connect(function(lights) {
//   lights.test();
// })
