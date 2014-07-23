'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,Auth,Util,$resource,$state) {
    $scope.today = Date.now();
    $scope.newMemorial = {};
    var currentUser = Auth.getCurrentUser()._id;

    $scope.createMemorial = function(form){
      if(form.$valid){
        var Memorial = $resource('/api/memorials');

        var newMemorial = new Memorial({
            admin_id: currentUser,
            name: $scope.newMemorial.name,
            date_of_birth: $scope.newMemorial.dateOfBirth,
            date_of_death: $scope.newMemorial.dateOfDeath,
            file: $scope.newMemorial.lastUploadingFile
        });

        // console.log(newMemorial);
        newMemorial.$save(function(item, putResponseHeaders) {
          //item => saved user object
          //putResponseHeaders => $http header getter
          $state.transitionTo('memorial.timeline', {id: item._id});
        }, function(error){
          // console.log(error);
          // console.log('error');
        });
      }
    };

    $scope.getFlowFileUniqueId = function(file){
      return currentUser + '-' + Util.getFlowFileUniqueId(file,currentUser);
    };
   
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.newMemorial.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };
  });
