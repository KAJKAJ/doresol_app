'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('memorial', {
        // abstract: true,
        url: '/memorial/:id',
        templateUrl: 'app/memorial/memorial.html',
        controller: 'MemorialCtrl',
        // onEnter: function(){
        //   console.log('enter main');
        // },
        // onExit: function(){
        //   console.log('exit main');
        // },
        authenticate: true
      })

      .state('memorial.profile', {
        templateUrl: 'app/memorial/profile/profile.html',
        controller: 'ProfileCtrl',
        authenticate: true
      })
      .state('memorial.timeline', {
        templateUrl: 'app/memorial/timeline/timeline.html',
        controller: 'TimelineCtrl',
        authenticate: true
      })
      .state('memorial.timeline.create', {
        templateUrl: 'app/memorial/timeline/timeline_create.html',
        authenticate: true
      })
      .state('memorial.storyline', {
        templateUrl: 'app/memorial/storyline/storyline.html',
        controller: 'StorylineCtrl',
        authenticate: true
      })
      .state('memorial_create', {
        templateUrl: 'app/memorial/create/create.html',
        // controller: 'MemorialCreateCtrl',
        authenticate: true
      });
  });

