'use strict';

angular.module('doresolApp')
  .controller('MemberCtrl', function ($scope, Memorial,$stateParams,User,$http,ENV,$location) {
  	// console.log('ProfileCtrl');
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    $scope.currentUser = User.getCurrentUser();

		var longUrl = {
    	longUrl : $location.host() + "/invites/" + $scope.memorialKey + "/" + $scope.currentUser.uid
    }

    $http.post(ENV.GOOGLE_API_URI, longUrl).success(function (data) {
    	console.log(data);
    });
    
  });

