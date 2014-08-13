'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$state,MyMemorial) {
    $scope.$state = $state;
    
  	$scope.memorialKey = $stateParams.id;
		MyMemorial.setCurrentMemorial($scope.memorialKey);
		$scope.memorial = MyMemorial.getCurrentMemorial();
		
		// if(!$scope.memorial){
		// 	$timeout(function(){
		// 		$scope.memorial = MyMemorial.getMyMemorial($scope.memorialKey);
		// 	},500);
		// }
// console.log($scope);
  });
