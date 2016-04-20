'use strict';

angular.module('tpApp')
  .factory('Conversation', function ($resource) {
    return $resource('/api/conversations', {}, {
      getConv: {
        method: 'POST',
        isArray: true
      }
	  });
  });
