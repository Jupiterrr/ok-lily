angular.module('starter', ['ionic', 'ionic.contrib.frostedGlass'])

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "tabs.html"
    })
    .state('tabs.actions', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "home.html",
          controller: 'PageCtrl'
        }
      }
    })
    .state('tabs.screens', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "about.html",
          controller: 'PageCtrl'
        }
      }
    })
    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "nav-stack.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

})

.controller('PageCtrl', function($scope, $ionicFrostedDelegate, $ionicScrollDelegate, $rootScope) {


  var connection = new WebSocket('ws://192.168.1.6:8080');

  connection.onopen = function () {
    console.log("WebSocket connected");
    // connection.send('Ping'); // Send the message 'Ping' to the server
  };

  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ', error);
  };

  // Log messages from the server
  connection.onmessage = function (e) {
    console.log('Server: ', e.data);
  };

  connection.onclose = function () {
    console.log("WebSocket closed");
    // connection.send('Ping'); // Send the message 'Ping' to the server
  };


  $scope.actions = [
    {
      name: "list",
      command: "list_users"
    },
    {
      name: "Licht an",
      command: "lights_on"
    },
    {
      name: "Licht aus",
      command: "lights_off"
    },
    {
      name: "blinken",
      command: "lights_alert"
    },
    {
      name: "alle anwesend",
      command: "all available"
    },
    {
      name: "start presi",
      command: "start presi"
    }
  ]

  $scope.screens = [
    {
      name: "Bildschirm 1",
      command: {
        command: "start share display",
        targetID: 1
      }
    },
    {
      name: "Bildschirm 2",
      command: {
        command: "start share display",
        targetID: 2
      }
    },
    {
      name: "next slide",
      command: {
        command: "next slide",
        targetID: "beamer"
      }
    },
    {
      name: "poll",
      command: {
        command: "open website",
        targetID: "beamer",
        payload: "http://google.com?q=poll"
      }
    }
  ];

  function send(msgObj) {
    var msg = JSON.stringify(msgObj);
    console.log("send: ", msg);
    connection.send(msg)
  }

  $scope.send = function(action) {
    var command = {
      command: action.command
    }
    send(command);
  }

  $scope.screen = function(screen) {
    send(screen.command);
  }
});


