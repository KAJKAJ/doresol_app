'use strict';

angular.module('doresolApp')
  .controller('MemberCtrl', function ($scope,Memorial,$stateParams,User,$http,ENV,$firebase,Composite) {
  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

    $scope.users = User.getUsersObject();
    $scope.members = {};
    $scope.waitings = {};

		var longUrl = {
    	"longUrl" : "http://localhost:9876/invites/" + $scope.memorialKey + "/" + $scope.currentUser.uid
    };

    $http.post(ENV.GOOGLE_API_URI, angular.toJson(longUrl)).success(function (data) {
    	$scope.inviteUrl = data.id;
    });

    $scope.memorial.$loaded().then(function(value) {
      $scope.leader = User.findById($scope.memorial.ref_user);
      User.setUsersObject($scope.memorial.ref_user);
    });

    var userMembersRef =  new Firebase(ENV.FIREBASE_URI + '/users');
    var memorialMembersRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/members');
    var _members = $firebase(memorialMembersRef).$asArray();

    _members.$watch(function(event){
      switch(event.event){
        case "child_removed":
          delete $scope.members[event.key];
          break;
        case "child_added":
          var childRef = userMembersRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            $scope.members[value.uid] = value;
            User.setUsersObject(value.uid);
          });
        break;
      }
    });

    var memorialWaitingsRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/waitings');
    var _waitings = $firebase(memorialWaitingsRef).$asArray();
    _waitings.$watch(function(event){
      switch(event.event){
        case "child_removed":
          delete $scope.waitings[event.key];
          break;
        case "child_added":
          var childRef = userMembersRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            $scope.waitings[value.uid] = value;
            User.setUsersObject(value.uid);
          });
        break;
      }
    });

    $scope.removeMember = function(uid) {
      var index = _members.$indexFor(uid);
      _members.$remove(index);

      var userMembersRef =  new Firebase(ENV.FIREBASE_URI + '/users/' + uid + '/memorials/members');
      $firebase(userMembersRef).$remove($scope.memorialKey).then(function(value){
        console.log(value);

      }, function(error) {
        console.log(error);

      });
    };

    // wainting to members
    $scope.moveMember = function(uid) {
      var index = _waitings.$indexFor(uid);
      _waitings.$remove(index);

      var params = { memorialId: $scope.memorialKey, inviteeId: uid} ;
      Composite.addMember(params).then(function(){
        console.log('Success');

      }, function(error){
        console.log(error);

      })
    };

  });

