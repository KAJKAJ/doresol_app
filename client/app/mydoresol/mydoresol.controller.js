'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope, $resource, Auth, MyMemorial, User) {
    $scope.myMemorials = MyMemorial.getMyMemorials();
    $scope.user = User.getCurrentUser();
  });
