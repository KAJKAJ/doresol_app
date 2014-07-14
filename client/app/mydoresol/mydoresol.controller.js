'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope,Auth) {
    //임시 로그인처리 시작
    Auth.login({
      email: 'test@test.com',
      password: 'test'
    });
    //임시 로그인처리 끝

    var user = Auth.getCurrentUser();
    console.log(user);
    

    $scope.toggle_create_form = function(){
    	$scope.create_form = !$scope.create_form;
    }

  });
