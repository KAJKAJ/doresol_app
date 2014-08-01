'use strict';

angular.module('doresolApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.createUser($scope.user).then(function (value){
          $location.path('/login');
        }, function(error){
          var errorCode = error.code;
          $scope.errors = {};

          switch(errorCode){
            case "EMAIL_TAKEN":
              form['email'].$setValidity('firebase',false);
              $scope.errors['email'] = '이미 등록된 이메일 주소입니다.';
            break;
          }
          // console.log(error);
        });
        // .then( function() {
          // Account created, redirect to home
          // $location.path('/');
        // })
        // .catch( function(err) {
          // err = err.data;
          // $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          // angular.forEach(err.errors, function(error, field) {
          //   form[field].$setValidity('mongoose', false);
          //   $scope.errors[field] = error.message;
          // });
        // });
      }
    };
  });