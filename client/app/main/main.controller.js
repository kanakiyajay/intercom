'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.messages = [];

    $http.get('/api/messages').success(function(messages) {
      $scope.messages = messages;
      $scope.syncUpdates('message', $scope.messages);
    });

    $scope.submitNewMessage = function(message, cust_id) {
      if (!message.length) {
        return;
      }

      $http.post('/api/messages', {
      	message: message,
      	created_for: cust_id
      }).success(function() {
        // Reset Messages
      	message = "";
      });
    };

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('message');
    });
  });
