'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV,MyMemorial) {
    $scope.$state = $state;
    
    // var memorial = Memorial.findById(memorialId);

		// memorial.$loaded().then(function (){
		// 	$scope.memorial = memorial;
		// });
		// $scope.memorial = Memorial.myMemorials[$stateParams.id];
		$scope.memorialKey = $stateParams.id;
		$scope.memorial = MyMemorial.getMyMemorial($scope.memorialKey);

		// console.log('memorial');
		// console.log($scope.memorial);

  });
