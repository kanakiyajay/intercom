'use strict';

angular.module('tpApp')
  .controller('MainCtrl', function ($scope, $http, Auth, Conversation, $state, $stateParams) {
    var user = Auth.getCurrentUser();
    $scope.refresh = function() {
      console.log('MainCtrl', 'Refresh called');
      if (!user.$promise) { return;}
      user.$promise.then(function(user) {
        Conversation
          .getConv()
          .$promise
          .then(function(resp) {
            $scope.conversations = resp;
            if (!$stateParams.conversationId) {
              if ($scope.conversations.length) {
                $state.transitionTo('conversation.details', {
                  conversationId: $scope.conversations[0]._id
                });
              }
            }
        })
      });
    };

    $scope.getLast = function(arr) {
      return arr[arr.length - 1];
    };

    $scope.getNumberUnread = function(arr) {
      var index = 0;
      arr.forEach(function(msg) {
        if (msg.status === 'unread' && msg.created_by !== user._id) {
          index ++;
        }
      });
      return index;
    };

    $scope.redirectTo = function(convId) {
      console.log('MainCtrl', 'Redirect To', convId);
      $state.transitionTo('conversation.details', {
        conversationId: convId
      });
    };

    $scope.isActive = function(convId) {
      return $state.params.conversationId === convId;
    };

    $scope.newConversation = function(custId, e) {
      console.log('new Conversation', custId);
      $state.transitionTo('conversation.new', {
        customerId: custId
      });
      e.stopPropagation();
    };

  });

angular.module('tpApp')
  .controller('ConversationCtrl', function ($scope, $http, Auth, $state, $stateParams, Message) {
    var user = Auth.getCurrentUser();

    $scope.messageRefresh = function() {
      console.log('ConversationCtrl', 'messageRefresh');
      if ($stateParams.conversationId) {
        $scope.convId = $stateParams.conversationId;
        Message.get({
          conversation_id: $scope.convId
        }).$promise.then(function(res) {
          $scope.messages = res;
          $scope.maskAsRead();
        }, function(err) {
          console.error(err);
        });
      }
    };

    $scope.submitNewMessage = function(mesg) {
      var oMesg = {
        message: mesg
      };

      if ($stateParams.conversationId) {
        oMesg.conversation_id = $scope.convId;
      } else {
        oMesg.customer_id = $stateParams.customerId;        
      }

      Message.send(oMesg).$promise.then(function(res) {
        $scope.messageRefresh();
        $scope.emptyInput();
        if ($stateParams.conversationId) {
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

    $scope.maskAsRead = function() {
      Message.postRead({
        ids: getUnreadMessages(),
        conversation_id: $scope.messages[0].conversation_id
      }).$promise.then(function(err, les) {
        if (err) return console.error(err);
        else console.log(les);
      });
    };

    $scope.emptyInput = function() {
      $scope.reply = '';
    };

    function getUnreadMessages() {
      var messages = $scope.messages;
      var ids = [];
      messages.forEach(function(mesg) {
        console.log(mesg, user);
        if (mesg.status === 'unread' && mesg.created_by._id !== user._id) {
          ids.push(mesg._id);
        }
      });
      return ids;
    }

  });