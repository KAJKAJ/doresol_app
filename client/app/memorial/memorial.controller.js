'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$state,Memorial,User) {
    $scope.$state = $state;
    
  	$scope.memorialKey = $stateParams.id;
		Memorial.setCurrentMemorial($scope.memorialKey);
		$scope.memorial = Memorial.getCurrentMemorial();
	  $scope.user = User.getCurrentUser();

		$scope.memorial.$loaded().then(function(value) {
			// 관리자 이거나 member가 아니면, 가입 요청하도록 수정
			if( $scope.user.uid !== $scope.memorial.ref_user ) {
				if( $scope.memorial.members === undefined 
					|| !$scope.memorial.members[$scope.user.uid]) {
					$state.go('request', {memorialId: $scope.memorialKey, requesterId: $scope.user.uid});
				}
			}
		});
  });
