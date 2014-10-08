'use strict';

angular.module('doresolApp')
  .controller('AgencyCtrl', function ($scope, $modal, $http, ENV, $firebase, Memorial) {

  	$scope.estimate = {};
  	
  	$scope.estimate.img = 100;
  	$scope.estimate.dvd = 0;
  	$scope.estimate.usb = 0;
  	$scope.estimate.tot = ($scope.estimate.img * 200 + $scope.estimate.dvd * 10000 + $scope.estimate.usb * 10000) / 10000;

		$scope.changeTot = function() {
			$scope.estimate.tot = ($scope.estimate.img * 200 + $scope.estimate.dvd * 10000 + $scope.estimate.usb * 10000) / 10000;
		}
});