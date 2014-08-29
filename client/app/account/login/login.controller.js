'use strict';

angular.module('doresolApp')
  .controller('LoginCtrl', function ($scope, Auth, User, $location, $window, $stateParams) {
    $scope.user = {};
    $scope.errors = {};

    console.log($stateParams);

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function (value){
          // $location.path('/mydoresol');
          $state.go("mydoresol");
          console.log(value);

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

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider);
    };
    
  });
