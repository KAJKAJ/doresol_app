'use strict';

angular.module('doresolApp')
  .controller('MemorialsCtrl', function ($scope, $resource, Auth, Memorial, User) {
	  $scope.user = User.getCurrentUser();
    $scope.myMemorials = Memorial.getMyMemorials();
    Memorial.fetchMyWaitingMemorials($scope.user.uid);
    $scope.myWaitingMemorials = Memorial.getMyWaitingMemorials();

	});
