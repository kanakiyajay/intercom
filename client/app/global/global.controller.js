'use strict';

angular.module('tpApp')
  .controller('GlobalCtrl', function ($scope, Auth, $location) {
    
    $scope.isAdmin = Auth.isAdmin;
    $scope.isLoggedIn = Auth.isLoggedIn;

    Auth.isLoggedInAsync(function(bool) {
      if (bool) {
        var user = Auth.getCurrentUser();
        user.$promise.then(function(user) {
          $scope.currentUser = user;
        });
      }
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
