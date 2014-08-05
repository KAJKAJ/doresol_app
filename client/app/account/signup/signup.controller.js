'use strict';

angular.module('doresolApp')
  .controller('SignupCtrl', function ($scope, Auth, User, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.register($scope.user).then(function (value){
          $location.path('/login');

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
  });