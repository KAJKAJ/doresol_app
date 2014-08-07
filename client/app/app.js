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
  'firebase'
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

  .run(function ($rootScope, $location, $state, Auth, User, editableOptions) {

    editableOptions.theme = 'bs3';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      var _get_user_auth = function(){
        return Auth.getCurrentUserFromFirebase().then(function(value){
          return value.uid;
        });
      };

      var _get_user_data = function(userId){
        return User.getCurrentUserFromFirebase(userId).then(function(value){
          return value;
        });
      };


      if (next.authenticate){
        if(!User.getCurrentUser()){
          event.preventDefault();
          
          _get_user_auth().then(_get_user_data).then(function(value){
            $state.go(next);
          },function(error){
            $location.path('/login');
          });
        }
      }
    });
  });
