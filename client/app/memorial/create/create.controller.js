'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,$resource,$state,Auth,Util,Memorial) {
    $scope.today = Date.now();
    $scope.newMemorial = {};
    var currentUser = Auth.getCurrentUser()._id;

    $scope.createMemorial = function(form){
      if(form.$valid){
        Memorial.save({},{
            admin_id: currentUser,
            name: $scope.newMemorial.name,
            date_of_birth: $scope.newMemorial.dateOfBirth,
            date_of_death: $scope.newMemorial.dateOfDeath,
            file: $scope.newMemorial.lastUploadingFile
        }).$promise.then(function (value) {
          $state.transitionTo('memorial.timeline', {id: value._id});
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
