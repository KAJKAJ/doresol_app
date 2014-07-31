'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,Memorial) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
    
    Memorial.get({id:memorialId}).$promise.then(function (value) {
      $scope.memorial = value;
      // console.log($scope);
      // $scope.memorial.name = 'test1';
      // $scope.memorial.timeline.era.push({
      // 	id:'aaa',
      // 	headline:'haha',
      // 	startDate:'20110302',
      // 	endDate:'20150320'
      // });
      // $scope.memorial.$save();
    });
  });
