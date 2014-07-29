'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
    var Memorial = $resource('/api/memorials/info/:id', {id:'@id'});
    
    $scope.memorial = Memorial.get({id:memorialId}, function() {     
     }, function(error){      
    });
  });
