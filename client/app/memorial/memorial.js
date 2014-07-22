'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorial', {
        url: '/memorial/:id',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl',
        authenticate: true
      })
      .state('memorial_create', {
        // url: '/memorial',
        templateUrl: 'app/memorial/memorial_create.html',
        // controller: 'MemorialCtrl',
        authenticate: true
      })
      // .state('memorial.profile', {
      //   // url: '/memorial',
      //   templateUrl: 'app/memorial/memorial_create.html',
      //   // controller: 'MemorialCtrl',
      //   authenticate: true
      // })
      .state('memorial.timeline', {
        url: '/memorial/:id/timeline',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'TimelineCtrl',
        authenticate: true
      })
      // .state('memorial.storyline', {
      //   // url: '/memorial',
      //   templateUrl: 'app/memorial/memorial_create.html',
      //   // controller: 'MemorialCtrl',
      //   authenticate: true
      // })
      ;
  });
