'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,Memorial) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
    
    Memorial.get({id:memorialId}).$promise.then(function (value) {
      $scope.memorial = value;
    });
  });
