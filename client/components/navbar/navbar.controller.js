'use strict';

angular.module('doresolApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
      // {
      //   'title': 'Home',
      //   'link': '/'
      // },
      {
        'title': 'My doresol',
        'link': '/mydoresol'
      },
      
    ];

    angular.element(window).bind("scroll", function() {
         if (this.pageYOffset >= 150) {
             $scope.shrink_header = true;
         } else {
             $scope.shrink_header = false;
         }
        $scope.$apply();
    });

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    $scope.toggle = function(){
      $scope.toggleMenu = true;
    };

    $scope.untoggle = function(){
      $scope.toggleMenu = false;
    };
  });