'use strict';

angular.module('tpApp')
  .controller('CustomerCtrl', function ($scope, Customer) {
    Customer.get().$promise.then(function(resp) {
    	$scope.customers = resp;
    });
  });
