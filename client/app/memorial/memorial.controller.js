'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV,Memorial) {
    $scope.$state = $state;
    
    // var memorial = Memorial.findById(memorialId);

		// memorial.$loaded().then(function (){
		// 	$scope.memorial = memorial;
		// });
		var memorialId = $stateParams.id;
		$scope.memorial = Memorial.myMemorials[memorialId];
		
  });

