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

      console.log($stateParams);
      // TODO: Do this everytime
    }

    $scope.redirectTo = function(convId) {
      $state.go('conversation.details', {
        conversationId: convId
      });
    }

    $scope.isActive = function(convId) {
      return $state.params.conversationId === convId;
    }

    $scope.newConversation = function(custId) {
      $state.go('conversation.new', {
        customerId: custId
      });
    }

  });

angular.module('tpApp')
  .controller('ConversationCtrl', function ($scope, $http, Auth, $stateParams, Message, $state) {

    if ($stateParams.conversationId) {
      $scope.convId = $stateParams.conversationId;
    } else {
      $scope.custId = $stateParams.customerId;
      $scope.convId = "new";
    }

    $scope.messageRefresh = function() {
      if ($scope.convId === "new") return;

      Message.get({
        conversation_id: $scope.convId
      }).$promise.then(function(res) {
        $scope.messages = res;
      }, function(err) {
        console.error(err);
      });
    };

    $scope.submitNewMessage = function(mesg) {
      var oMesg = {
        message: mesg
      };

      if ($scope.isOldConversation()) {
        oMesg.conversation_id = $scope.convId;
      } else {
        // TODO: Attach customer id over here
      }

      Message.send(oMesg).$promise.then(function(res) {

        $scope.messageRefresh();
        $scope.emptyInput();
        if ($scope.isOldConversation()) {
          $scope.refresh();
        } else {
          console.log('new Conversation', res.conversation_id);
          $state.go('conversation.details', {
            conversationId: res.conversation_id
          }).then(function(suc) {
            $scope.refresh();
          });
        }
      }, function(error) {
        console.error(error);
      });
    };

    // true means that convId already present
    $scope.isOldConversation = function() {
      if (!convId) return false;
      if (convId === "new") return false;
      return true;
    };

    $scope.emptyInput = function() {
      $scope.reply = '';
    };
  });