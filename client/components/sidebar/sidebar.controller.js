'use strict';

angular.module('tpApp')
  .controller('SidebarCtrl', function ($scope) {
    
    $scope.selectConversation = function(convId) {
      $scope.$emit("convId", convId);
    };

  });