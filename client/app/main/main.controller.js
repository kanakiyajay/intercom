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
      // TODO: Do this everytime
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
  .controller('ConversationCtrl', function ($scope, $http, Auth, $stateParams, Message) {

    if ($stateParams.conversationId) {
      var convId = $stateParams.conversationId;
    } else {
      var custId = $stateParams.customerId;
      var convId = "new";
    }

    $scope.messageRefresh = function() {
      if (!$scope.isCustomerAttached()) return;

      Message.get({
        conversation_id: convId
      }).$promise.then(function(res) {
        $scope.messages = res;
        $scope.convId = convId;
      }, function(err) {
        console.error(err);
      })
    };

    $scope.submitNewMessage = function(mesg) {
      var oMesg = {
        message: mesg
      };

      if ($scope.isCustomerAttached()) {
        oMesg.conversation_id = convId;
      }

      Message.send(oMesg).$promise.then(function(res) {

        $scope.messageRefresh();
        $scope.emptyInput();

        if ($scope.isCustomerAttached()) {
          $scope.refresh();
        }
      }, function(error) {
        console.error(error);
      });
    };

    // true means that convId already present
    $scope.isCustomerAttached = function() {
      if (!convId) return false;
      if (convId === "new") return false;
      return true;
    };

    $scope.emptyInput = function() {
      $scope.reply = '';
    };
  });