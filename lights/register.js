var hue = require("node-hue-api");

function register(host) {
  var HueApi = require("node-hue-api").HueApi;

  var hostname = host; //"192.168.2.129",
      newUserName = null // You can provide your own username value, but it is normally easier to leave it to the Bridge to create it
      userDescription = "Hackathon 2014";

  var displayUserResult = function(result) {
      console.log("Created user: " + JSON.stringify(result));
  };

  var displayError = function(err) {
      console.log(err);
  };

  var hue = new HueApi();

  // --------------------------
  // Using a promise
  hue.registerUser(hostname, newUserName, userDescription)
      .then(displayUserResult)
      .fail(displayError)
      .done();

}


// register("192.168.1.3");


