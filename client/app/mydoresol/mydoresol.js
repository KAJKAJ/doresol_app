'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('mydoresol', {
        url: '/mydoresol',
        templateUrl: 'app/mydoresol/mydoresol.html',
        controller: 'MydoresolCtrl'
      });
  });