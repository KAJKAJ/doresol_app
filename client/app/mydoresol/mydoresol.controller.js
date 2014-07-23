'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope,Auth,$resource) {
    //임시 로그인처리 시작
    Auth.login({
      email: 'test@test.com',
      password: 'test'
    });
    
    // console.log(user);
  	//임시 로그인처리 끝

    var userId = Auth.getCurrentUser()._id;
    var Memorial = $resource('/api/memorials/:user_id');

    var myMemorials = Memorial.query({user_id:userId},function(item, getResponseHeaders) {
      //item => saved user object
      //putResponseHeaders => $http header getter
      $scope.myMemorials = item;
      console.log($scope.myMemorials);
    }, function(error){
      // console.log(error);
      // console.log('error');
    });
    

  });
