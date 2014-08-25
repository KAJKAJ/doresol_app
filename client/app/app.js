'use strict';

angular.module('doresolApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router',
  'flow',
  'xeditable',
  'config',
  'firebase',
  'ui.sortable'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  
  .config(['datepickerConfig', function(datepickerConfig) {
    //datepicker
    datepickerConfig.showWeeks = false;
    datepickerConfig.maxDate="9999-12-31";
  }])

  .config(function($provide) {
    $provide.decorator('$state', function($delegate) {
      $delegate.reinit = function() {
        this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
      };
      return $delegate;
    });
  })
  
  .config(['datepickerPopupConfig', function(datepickerPopupConfig) {
    datepickerPopupConfig.currentText = "오늘";
    datepickerPopupConfig.clearText = "취소";
    // datepickerPopupConfig.toggleWeeksText = "week?";
    datepickerPopupConfig.closeText = "닫기";
  }]) 
  

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      // request: function (config) {
      //   config.headers = config.headers || {};
      //   if ($cookieStore.get('token')) {
      //     config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      //   }
      //   return config;
      // },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          // $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, $state, Auth, User, editableOptions, Composite) {

    editableOptions.theme = 'bs3';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      var _getUserAuth = function(){
        return Auth.getCurrentUserFromFirebase().then(function(value){
          return value.uid;
        });
      };

      var _getUserData = function(userId){
        return User.getCurrentUserFromFirebase(userId).then(function(value){
          return value.uid;
        });
      };

      if (toState.authenticate){
        if(!User.getCurrentUser()){
          event.preventDefault();
          _getUserAuth().then(_getUserData).then(Composite.setMyMemorials).then(function(value){
            $state.go(toState, toParams);
            // $state.go(toState, toParams,{notify:false});
          },function(error){
            $location.path('/login');
          });
        }
      }
    });
  });
