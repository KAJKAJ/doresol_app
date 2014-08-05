'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state,ENV) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
    
  });

