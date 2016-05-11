'use strict';

angular.module('tpApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('conversation', {
        url: '/',
        templateUrl: 'components/message/board.html',
        controller: 'MainCtrl'
      })
      .state('conversation.details', {
        url: '/conversation/{conversationId}',
        templateUrl: 'components/message/message.html',
        controller: 'ConversationCtrl'
      })
      .state('conversation.new', {
        url: '/conversation/new/{customerId}',
        templateUrl: 'components/message/message.html',
        controller: 'ConversationCtrl'
      })
      .state('customer', {
      	url: '/customer',
      	templateUrl: 'app/customer/customer.html',
      	controller: 'CustomerCtrl'
      })
      .state('custDetails', {
        url: '/customer/{customerId}',
        templateUrl: 'app/customer/customer.details.html',
        controller: 'CustomerDetailsCtrl'
      });
  });