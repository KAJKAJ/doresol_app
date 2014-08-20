'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$state,Memorial) {
    $scope.$state = $state;
    
  	$scope.memorialKey = $stateParams.id;
		Memorial.setCurrentMemorial($scope.memorialKey);
		$scope.memorial = Memorial.getCurrentMemorial();
  });
