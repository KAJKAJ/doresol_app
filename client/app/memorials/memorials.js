'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorials', {
        url: '/memorials',
        templateUrl: 'app/memorials/memorials.html',
        controller: 'MemorialsCtrl',
        authenticate: true
      });
  });