'use strict';

angular.module('doresolApp')
  .controller('InvitesCtrl', function ($scope, Util, $stateParams, Memorial, User,$state) {

    console.log($stateParams);
    $scope.memorial = Memorial.findById($stateParams.memorialId);

    $scope.memorial.$loaded().then(function (value) {
    });

    $scope.inviterUserId = $stateParams.userId;
    $scope.users = User.getUsersObject();

    User.setUsersObject($scope.inviterUserId);

    $scope.cancel = function() {
      $state.go('login');
    }

    $scope.accept = function() {
      $state.go('login.invites', {memorialId: $stateParams.memorialId, userId: $stateParams.userId});
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