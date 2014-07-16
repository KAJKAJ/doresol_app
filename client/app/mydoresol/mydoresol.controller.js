'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope,Auth) {
    //임시 로그인처리 시작
    Auth.login({
      email: 'test@test.com',
      password: 'test'
    });
    
    // var user = Auth.getCurrentUser();
    // console.log(user);
  	//임시 로그인처리 끝


  });
