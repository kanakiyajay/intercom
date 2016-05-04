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

    $scope.messageRefresh = function(convId) {
      Message.get({
        conversation_id: convId
      }).$promise.then(function(res) {
        $scope.messages = res;
        $scope.convId = convId;
      }, function(err) {
        console.log(err);
      })
    }

    $scope.submitNewMessage = function(convId, mesg) {
      // Apply Validations over here
      Message.send({
        conversation_id: convId,
        message: mesg
      }).$promise.then(function(res) {
        $scope.refresh();
        $scope.messageRefresh(convId);
      }, function(error) {
        console.error(error);
      });
    };

    $scope.emptyInput = function() {
      $scope.reply = '';
    };
  });
