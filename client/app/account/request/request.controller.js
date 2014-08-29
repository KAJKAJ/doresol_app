'use strict';

angular.module('doresolApp')
  .controller('RequestCtrl', function RequestCtrl($scope, Util, $stateParams, Memorial, User,$state) {

    $scope.memorial = Memorial.findById($stateParams.memorialId);
    $scope.users = User.getUsersObject();

    console.log($scope.memorial);

    $scope.memorial.$loaded().then(function() {
        User.setUsersObject($scope.memorial.ref_user);    
    })
    
    $scope.cancel = function() {
      $state.go('mydoresol');
    }

    $scope.accept = function() {
        console.log($state.params);
        Memorial.addWaiting($state.params.memorialId, $state.params.requesterId).then(function(value){
            $state.go('mydoresol');
        });
    }

    // $scope.openModal = function (story) {
    //   var modalInstance = $modal.open({
    //     templateUrl: 'app/memorial/story/edit_modal.html',
    //     controller: 'ModalCtrl',
    //     size: 'lg',
    //     resolve: { 
    //       paramFromDialogName: function(){
    //         return 'story';
    //       },         
    //       paramFromDialogObject: function () {
    //         console.log(story);
    //         return story;
    //       }
    //     }
    //   });

    //   modalInstance.result.then(function (paramFromDialogObject) {
    //     //click ok
    //     // console.log('click ok');
    //     // $scope.paramFromDialogObject = paramFromDialogObject;
    //     console.log($scope);
    //   }, function () {
    //     //canceled
    //   });
    // };

  });