'use strict';

angular.module('doresolApp')
  .controller('LoginCtrl', function ($scope, Auth, User, $window,$state,Memorial,Composite) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function (value){
          Memorial.clearMyMemorial();
          Composite.setMyMemorials(value.uid).then(function(){
              // $location.path('/mydoresol');
            if ($state.params.memorialId !== undefined) {
              $state.params.inviteeId = value.uid;
              Composite.addMember($state.params).then(function(){
                $state.go("mydoresol");
              });
            } else {
              $state.go("mydoresol");
            }
          });

        } ,function(error){
          // console.log(error);
          var errorCode = error.code;
          switch(errorCode){
            case "INVALID_USER":
              $scope.errors.other = "등록되어있지 않은 이메일 주소입니다.";
            break;
            case "INVALID_PASSWORD":
              $scope.errors.other = "잘못된 패스워드입니다.";
            break;
          }
        });        
      }
    };

    $scope.toRegister = function() {
      if($state.params.memorialId !== undefined) {
        $state.go('signup.invites', {memorialId: $state.params.memorialId, inviterId: $state.params.inviterId});
      } else {
        $state.go('signup');
      }
    };

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider).then(function(value){
        Memorial.clearMyMemorial();
        Composite.setMyMemorials(value.uid).then(function(){

          if ($state.params.memorialId !== undefined) {
            $state.params.inviteeId = value.uid;
            Composite.addMember($state.params).then(function(){
              $state.go("mydoresol");
            });
          } else {
            $state.go("mydoresol");
          }

        });
      });
    };
    
  });
