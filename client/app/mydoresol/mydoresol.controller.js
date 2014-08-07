'use strict';

angular.module('doresolApp')
  // .controller('MydoresolCtrl', function ($scope) {
  .controller('MydoresolCtrl', function ($scope, $resource, Auth, MyMemorial, User) {
    //임시 로그인처리 시작
    // Auth.login({
    //   email: 'test@test.com',
    //   password: 'test'
    // });
    
    // console.log(user);
  	// 임시 로그인처리 끝
    // var uid = $rootScope.currentUser.uid;
    // var currentUser = Auth.getCurrentUser();
    
    // $scope.user = User.findById(currentUser.uid);

    $scope.myMemorials = MyMemorial.getMyMemorials();
    $scope.user = User.getCurrentUser();

    // if($scope.user.memorials){
    //     angular.forEach($scope.user.memorials.own, function(memorial, key) {
    //       var memorial = Memorial.findById(key);

    //       memorial.$loaded().then(function() {
    //         $scope.myMemorials[key] = memorial;
    //         // console.log($scope.myMemorials);
    //       });
    //     });
    // }

    // Memorial.query({admin_id:userId}).$promise.then(function (value) {
    //   $scope.myMemorials = value;
    // });
    
    // var Memorial = $resource('/api/memorials/:user_id');

    // var myMemorials = Memorial.query({user_id:userId},function(item, getResponseHeaders) {
    //   //item => saved user object
    //   //putResponseHeaders => $http header getter
    //   $scope.myMemorials = item;
    // }, function(error){
    //   // console.log(error);
    //   // console.log('error');
    // });
    

  });
