'use strict';

angular.module('doresolApp')
  .controller('MemorialCreateCtrl', function ($scope,Auth,Util,$resource,$state) {
    $scope.today = Date.now();
    $scope.new_memorial = {};
    var current_user = Auth.getCurrentUser()._id;

    $scope.create_memorial = function(form){
      if(form.$valid){
        var Memorial = $resource('/api/memorials');

        var new_memorial = new Memorial({
            admin_id: current_user,
            name: $scope.new_memorial.name,
            date_of_birth: $scope.new_memorial.date_of_birth,
            date_of_death: $scope.new_memorial.date_of_death,
            file: $scope.new_memorial.last_uploading_file
        });

        // console.log(new_memorial);
        new_memorial.$save(function(item, putResponseHeaders) {
          //item => saved user object
          //putResponseHeaders => $http header getter
          $state.transitionTo('memorial.timeline', {id: item._id});
        }, function(error){
          // console.log(error);
          // console.log('error');
        });
      }
    };

    $scope.getUniqueId = function(file){
      var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name;
      return current_user + '-' + Util.getUniqueId() + '-' + relativePath.replace(/[^\.0-9a-zA-Z_-]/img, '');
    };

    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.new_memorial.last_uploading_file = flowFile.uniqueIdentifier;
    });

    $scope.open_datepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };
  });
