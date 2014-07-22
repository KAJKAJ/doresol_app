'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      // .state('memorial', {
      //   url: '/memorial/:id',
      //   templateUrl: 'app/memorial/memorial.html',
      //   controller: 'MemorialCtrl',
      //   authenticate: true
      // })
      
      .state('memorial', {
        abstract: true,
        url: '/memorial/:id',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl',
        authenticate: true
      })

      .state('memorial.profile', {
        url:'',
        // url: '/profile',
        templateUrl: 'app/memorial/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('memorial.timeline', {
        url:'',
        // url: '/timeline',
        templateUrl: 'app/memorial/timeline/timeline.html',
        controller: 'TimelineCtrl',
        authenticate: true
      })
      .state('memorial.storyline', {
        url:'',
        // url: '/storyline',
        templateUrl: 'app/memorial/storyline/storyline.html',
        controller: 'StorylineCtrl',
        authenticate: true
      })
      .state('memorial_create', {
        // url: '/memorial',
        templateUrl: 'app/memorial/memorial_create.html',
        // controller: 'MemorialCtrl',
        authenticate: true
      })      
      ;
  });
