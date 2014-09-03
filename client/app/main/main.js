'use strict';

angular.module('doresolApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main_invites', {
        url: '/invited/:memorialId/:inviterId',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });