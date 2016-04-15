'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.messages = [];
    $scope.reply = '';

    $http.get('/api/messages?conversation_id=56cb91bdc3464f14678934ca').success(function(messages) {
      $scope.messages = messages;
      $scope.syncUpdates('message', $scope.messages);
    });

    $scope.submitNewMessage = function(message, cust_id) {
      if (!message.length) {
        return;
      }

      $http.post('/api/messages', {
      	message: message
      }).success(function() {
        // Reset Messages
      	$scope.reply = '';
      });
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('message');
    });
  });
