'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope, $resource, Auth, Memorial, User) {
    $scope.myMemorials = Memorial.getMyMemorials();
		$scope.user = User.getCurrentUser();

		// console.log($scope.user);
		
  });
