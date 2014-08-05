'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,$rootScope, $resource,$state,Auth,Util,Memorial,User) {
    $scope.today = Date.now();
    $scope.newMemorial = {};
    var currentUser = $rootScope.currentUser;

    $scope.createMemorial = function(form){
      if(form.$valid){
        Memorial.create({
            name: $scope.newMemorial.name,
            date_of_birth: $scope.newMemorial.dateOfBirth,
            date_of_death: $scope.newMemorial.dateOfDeath,
            file: {
              location: 'local',
              url: '/tmp/' + $scope.newMemorial.lastUploadingFile,
              updated_at: moment().toString()
            }
        }).then(function (value) {
          $state.transitionTo('memorial.timeline', {id: value.name()});
        });
      }
    };

    $scope.getFlowFileUniqueId = function(file){
      return currentUser.id + '-' + Util.getFlowFileUniqueId(file,currentUser);
    };
   
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      console.log('here');
      $scope.fileUploading = false;
      $scope.newMemorial.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };
  });
