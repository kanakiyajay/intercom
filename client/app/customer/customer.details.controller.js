'use strict';

angular.module('tpApp')
  .controller('CustomerDetailsCtrl', function ($scope, $stateParams, Customer, $state) {
    Customer
    	.get({ customerId: $stateParams.customerId })
    	.$promise.then(function(resp) {
		    $scope.customer = resp[0];
    	});

    $scope.redirectToConv = function(convId) {
    	$state.go('conversation.details', {
    		conversationId: convId
    	});
    };
  });
