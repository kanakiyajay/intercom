'use strict';

angular.module('tpApp')
  .controller('CustomerCtrl', function ($scope, Customer, $state) {
    Customer.get().$promise.then(function(resp) {
    	$scope.customers = resp;
    });

    $scope.redirectTo = function(custId) {
    	$state.go('custDetails', {
    		customerId: custId
    	});
    };

    $scope.newConversation = function(custId) {
      console.log('go to new custId', custId);
      $state.go('conversation.new', {
        customerId: custId
      });
    };
  });
