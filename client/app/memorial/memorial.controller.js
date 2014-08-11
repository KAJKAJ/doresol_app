'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV,MyMemorial) {
    $scope.$state = $state;
    
  	$scope.memorialKey = $stateParams.id;
		$scope.memorial = MyMemorial.getMyMemorial($scope.memorialKey);
// console.log($scope);
  });
