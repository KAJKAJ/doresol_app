'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV,Memorial) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
		var memorial = Memorial.findById(memorialId);

		memorial.$loaded().then(function (){
			$scope.memorial = memorial;
		});

  });

