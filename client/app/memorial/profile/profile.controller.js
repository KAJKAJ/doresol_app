'use strict';

angular.module('doresolApp')
  .controller('ProfileCtrl', function ($scope,$stateParams,Util,Composite, User, Memorial) {
    $scope.today = Date.now();
    
    $scope.currentUser = User.getCurrentUser();
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    
    $scope.lastUploadingFile = null;

    $scope.copyMemorial = {};
		$scope.memorial.$loaded().then(function(value){
      angular.copy($scope.memorial,$scope.copyMemorial);
    });


    $scope.updateMemorial = function(form){
    	if(form.$valid){
    		Memorial.update($scope.copyMemorial.$id,
    			{
    				name:$scope.copyMemorial.name,
    				dateOfBirth:moment($scope.copyMemorial.dateOfBirth).format("YYYY-MM-DD"),
    				dateOfDeath:moment($scope.copyMemorial.dateOfDeath).format("YYYY-MM-DD")
    			}
    		).then(function(){
    			$scope.message = '저장되었습니다.';
    		});
    	}
    }
    // $scope.createMemorial = function(form){
    //   if(form.$valid){
    //     var file = null;
    //     if($scope.newMemorial.lastUploadingFile){
    //       file = {
    //           location: 'local',
    //           url: '/tmp/' + $scope.newMemorial.lastUploadingFile,
    //           updated_at: moment().toString()
    //         }
    //     }

    //     var memorial = {
    //         name: $scope.newMemorial.name,
    //         dateOfBirth: moment($scope.newMemorial.dateOfBirth).format("YYYY-MM-DD"),
    //         dateOfDeath: moment($scope.newMemorial.dateOfDeath).format("YYYY-MM-DD"),
    //         file:file,
    //         ref_user:$scope.currentUser.uid,
    //         public: $scope.newMemorial.public
    //     };
        
    //     Composite.createMemorial(memorial).then(function (value) {
    //       $state.transitionTo('memorial.timeline', {id: value.name()});
    //     });
    //   }
    // }

    $scope.changeProfileImage = function(){
    	var file = null;
      if($scope.lastUploadingFile){
        file = {
          location: 'local',
          url: '/tmp/' + $scope.lastUploadingFile,
          updated_at: moment().toString()
        }
        $scope.memorial.file = file;
        Composite.changeMemorialProfileImage($scope.memorial).then(function (value) {
          $scope.lastUploadingFile = null;
        });
      }
    }

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file);
    }
   
    $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
      $scope.fileUploading = false;
      $scope.lastUploadingFile = flowFile.uniqueIdentifier;
    });

    $scope.$on('flow::fileAdded', function (event, $flow, flowFile, message) {
      $scope.lastUploadingFile = null;
    });

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = !$scope[variable];
      console.log($scope[variable]);
    }
  });
