'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];

    $http.get('/api/messages').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.submitNewMessage = function(message) {
      
    };
  });
