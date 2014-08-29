'use strict';

angular.module('doresolApp')
  .controller('MemberCtrl', function ($scope, Memorial,$stateParams,User,$http,ENV,$location) {
  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

		var longUrl = {
    	"longUrl" : "http://localhost:9876/invites/" + $scope.memorialKey + "/" + $scope.currentUser.uid
    };

    $http.post(ENV.GOOGLE_API_URI, angular.toJson(longUrl)).success(function (data) {
    	$scope.inviteUrl = data.id;
    });

  });

