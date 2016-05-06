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
  });
