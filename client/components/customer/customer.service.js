'use strict';

angular.module('tpApp')
  .factory('Customer', function ($resource) {
    return $resource('/api/customers', {}, {
	      get: {
	        method: 'GET',
	        isArray: true
	      }
	  });
  });
