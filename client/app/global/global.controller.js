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
      } else {
        console.log('Not Logged In');
      }
    });

    $scope.$on('refreshUser', function() {
      Auth.isLoggedInAsync(function(bool) {
        if (bool) {
          var user = Auth.getCurrentUser();
          user.$promise.then(function(user) {
            $scope.currentUser = user;
          });
        } else {
          console.log('Not Logged In');
        }
      });      
    });

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
