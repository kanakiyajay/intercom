'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, Auth, Conversation, Message) {
    var user = Auth.getCurrentUser();
    $scope.refresh = function() {
      if (!user.$promise) { return;}
      user.$promise.then(function(user) {
        $scope.currentUser = user;
        Conversation.getConv({
          conversations: user.conversations
        }).$promise.then(function(resp) {
          $scope.conversations = resp;
        })
      });
    }

    $scope.submitNewMessage = function(conv_id, mesg) {
      // Apply Validations over here
      Message.send({
        conversation_id: conv_id,
        message: mesg,        
        created_by_model: 'Employee',
        type: 'e2c'
      }).$promise.then(function(res) {
        $scope.refresh();
      }, function(error) {
        console.error(error);
      });
    };
  });
