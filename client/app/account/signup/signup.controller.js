'use strict';

angular.module('doresolApp')
  .controller('SignupCtrl', function ($scope, Auth, User, $stateParams, $state) {
    $scope.user = {};
    $scope.errors = {};

    console.log($state.params);

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.register($scope.user).then(function (value){
          Composite.addMember($state.params).then(function(){
            $state.go("mydoresol");
          });

          $state.go('mydoresol');

        }, function(error){
          var errorCode = error.code;
          $scope.errors = {};
          console.log(error);
          switch(errorCode){
            case "EMAIL_TAKEN":
              form['email'].$setValidity('firebase',false);
              $scope.errors['email'] = '이미 등록된 이메일 주소입니다.';
            break;
          }
          
        });
      }
    };

    $scope.toLogin = function() {
      if($state.params.memorialId !== undefined) {
        $state.go('login.invites', {memorialId: $state.params.memorialId, userId: $state.params.userId});
      } else {
        $state.go('login');
      }
    }
  });