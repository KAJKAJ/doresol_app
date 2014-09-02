'use strict';

angular.module('doresolApp')
  .controller('MemorialsCtrl', function ($scope, $resource, Auth, Memorial, User) {
    $scope.myMemorials = Memorial.getMyMemorials();
		$scope.user = User.getCurrentUser();

	});
