'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,Memorial,ENV) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;

    Memorial.get({id:memorialId}).$promise.then(function (value) {
      $scope.memorial = value;
      // console.log($scope);
      // $scope.memorial.name = 'test2';
      // $scope.memorial.timeline.era.push({
      // 	id:'aaa',
      // 	headline:'haha',
      // 	startDate:'20110304',
      // 	endDate:'20150325'
      // });
      // $scope.memorial.$save();
    });
  });
