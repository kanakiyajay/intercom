'use strict';

angular.module('tpApp')
  .factory('Message', function ($resource) {
    return $resource('/api/messages/', {}, {
      send: {
        method: 'POST'
      }
    });
  });
