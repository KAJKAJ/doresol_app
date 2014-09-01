'use strict';

angular.module('doresolApp')
  .controller('MainCtrl', function ($scope, $http, Auth,Memorial,Composite,$state, ENV, $firebase) {
    // $scope.awesomeThings = [];

    // $http.get('/api/things').success(function(awesomeThings) {
    //   $scope.awesomeThings = awesomeThings;
    //   socket.syncUpdates('thing', $scope.awesomeThings);
    // });

    // $scope.addThing = function() {
    //   if($scope.newThing === '') {
    //     return;
    //   }
    //   $http.post('/api/things', { name: $scope.newThing });
    //   $scope.newThing = '';
    // };

    // $scope.deleteThing = function(thing) {
    //   $http.delete('/api/things/' + thing._id);
    // };

    // $scope.$on('$destroy', function () {
    //   socket.unsyncUpdates('thing');
    // });
    $scope.muted = true;

    $scope.mute = function(){
      $("video")[0].muted=true;
      $scope.muted = true;
    };
    $scope.unmute = function(){
      $("video")[0].muted=false;
      $scope.muted = false;
    };

    $scope.loginOauth = function(provider) {
      Auth.loginOauth(provider).then(function(value){
        Memorial.clearMyMemorial();
        Composite.setMyMemorials(value.uid).then(function(){
          $state.go('mydoresol');
        });
      });
    };

    
    $scope.recentMemorials = [];
    var recentMemorialsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/');
    var recentMemorials = recentMemorialsRef.limit(12);

    recentMemorials.on('child_added', function(value) { 
      var memorial = value.val();
      memorial.$id = value.name();
      $scope.recentMemorials.unshift(memorial);
    });

  });