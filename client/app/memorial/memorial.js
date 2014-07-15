'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorial', {
        url: '/memorial',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl',
        authenticate: true
      })
      .state('memorial_create', {
        // url: '/memorial',
        templateUrl: 'app/memorial/memorial_create.html',
        controller: 'MemorialCtrl',
        authenticate: true
      });
  });