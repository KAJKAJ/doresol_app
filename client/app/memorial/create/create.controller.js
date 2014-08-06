'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,$rootScope, $resource,$state,Auth,Util,Memorial,User) {
    $scope.today = Date.now();
    $scope.newMemorial = {};
    $scope.currentUser = User.getCurrentUser();
    $scope.createMemorial = function(form){
      if(form.$valid){
        var file = null;
        if($scope.newMemorial.lastUploadingFile){
          file = {
              location: 'local',
              url: '/tmp/' + $scope.newMemorial.lastUploadingFile,
              updated_at: moment().toString()
            }
        }

        var memorial = {
            name: $scope.newMemorial.name,
            date_of_birth: $scope.newMemorial.dateOfBirth,
            date_of_death: $scope.newMemorial.dateOfDeath,
            file:file
        };

        Memorial.create(memorial).then(function (value) {
          $state.transitionTo('memorial.timeline', {id: value.name()});
        });
      }
    };

    $scope.getFlowFileUniqueId = function(file){

      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file);
    };
   
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.newMemorial.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.$on('flow::fileAdded', function (event, $flow, flowFile, message) {
      $scope.newMemorial.lastUploadingFile = null;
    });

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };
  });
