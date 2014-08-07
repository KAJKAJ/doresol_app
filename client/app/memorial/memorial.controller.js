'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV,Memorial) {
    $scope.$state = $state;
    
    // var memorial = Memorial.findById(memorialId);

		// memorial.$loaded().then(function (){
		// 	$scope.memorial = memorial;
		// });
		// $scope.memorial = Memorial.myMemorials[$stateParams.id];

		var obj = Memorial.findById($stateParams.id);
    obj.$loaded().then(function(){
      $scope.memorial = obj;
    });

		// console.log('memorial');
		// console.log($scope.memorial);

  });
