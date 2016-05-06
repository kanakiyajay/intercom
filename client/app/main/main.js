'use strict';

angular.module('tpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('customer', {
      	url: '/customer',
      	templateUrl: 'app/customer/customer.html',
      	controller: 'CustomerCtrl'
      });
  });