'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorial', {
        url: '/memorial',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl'
      });
  });