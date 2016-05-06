'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, Auth, Conversation, $state, $stateParams) {
    var user = Auth.getCurrentUser();
    $scope.refresh = function() {      
      if (!user.$promise) { return;}
      user.$promise.then(function(user) {
        Conversation.getConv({
          conversations: user.conversations
        }).$promise.then(function(resp) {
          $scope.conversations = resp;
          if ($scope.conversations.length) {
            $state.go('conversation.details', {
              conversationId: $scope.conversations[0]._id
            });
          }
        })
      });
    }

    $scope.isActive = function(convId) {
      return $state.params.conversationId === convId;
    }

  });

angular.module('tpApp')
  .controller('ConversationCtrl', function ($scope, $http, Auth, $stateParams, Message) {

    var convId = $stateParams.conversationId;

    $scope.messageRefresh = function() {
      Message.get({
        conversation_id: convId
      }).$promise.then(function(res) {
        $scope.messages = res;
        $scope.convId = convId;
      }, function(err) {
        console.log(err);
      })
    }

    $scope.submitNewMessage = function(mesg) {
      // Apply Validations over here
      Message.send({
        conversation_id: convId,
        message: mesg
      }).$promise.then(function(res) {
        $scope.refresh();
        $scope.messageRefresh();
      }, function(error) {
        console.error(error);
      });
    };

    $scope.emptyInput = function() {
      $scope.reply = '';
    };
  });