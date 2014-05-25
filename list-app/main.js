angular.module('starter', ['ionic', 'ionic.contrib.frostedGlass'])

.controller('PageCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {
  
  $scope.devices = [];

  var connection = new WebSocket('ws://192.168.1.2:8080');

  connection.onopen = function () {
    console.log("WebSocket connected");
    // connection.send('Ping'); // Send the message 'Ping' to the server
    send({command: "list_users"});
  };

  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    console.log('Server: ', e.data);
    var obj = JSON.parse(e.data);
    if (obj.command == "notification") {
      $scope.devices = obj.devices;
    }
    if (obj.command == "list_users") {
      console.log("omg", obj.payload.participants)
      $scope.$apply(function(){
        $scope.devices = obj.payload.participants
      });
    }
  };

  connection.onclose = function () {
    console.log("WebSocket closed");
    // connection.send('Ping'); // Send the message 'Ping' to the server
  };


  // $scope.actions = [
  //   {
  //     name: "list",
  //     command: "list_users"
  //   },
  //   {
  //     name: "Licht an",
  //     command: "lights_on"
  //   },
  //   {
  //     name: "Licht aus",
  //     command: "lights_off"
  //   },
  //   {
  //     name: "blinken",
  //     command: "lights_alert"
  //   }
  // ]


  function send(msgObj) {
    var msg = JSON.stringify(msgObj);
    console.log("send: ", msg);
    connection.send(msg)
  }

});


