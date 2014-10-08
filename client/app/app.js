'use strict';

angular.module('doresolApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap',
  'ui.router',
  'flow',
  // 'xeditable',
  'config',
  'firebase',
  'ui.sortable',
  'wu.masonry',
  'google-maps',
  'ngAutocomplete',
  'ngAnimate',
  'videosharing-embed',
  'ngDialog'
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

  .config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        showClose: true,
        closeByDocument: true,
        closeByEscape: true
    });
  }])

  .config(function($provide) {
    $provide.decorator('$state', function($delegate) {
      $delegate.reinit = function() {
        this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
      };
      return $delegate;
    });

    //temporary solution for angular-bootstrap datepicker format error in 0.11.0 version
    $provide.decorator('dateParser', function($delegate){
      var oldParse = $delegate.parse;
      $delegate.parse = function(input, format) {
        if ( !angular.isString(input) || !format ) {
          return input;
        }
        return oldParse.apply(this, arguments);
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

  // .run(function ($rootScope, $location, $state, Auth, User, editableOptions, Composite) {
  .run(function ($rootScope, $location, $state, Auth, User, Composite, $modal, ngDialog) {

    // editableOptions.theme = 'bs3';
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
              $rootScope.modalOpen = true;
              $rootScope.toState = toState;
              $rootScope.toParams = toParams;
              
              ngDialog.openConfirm({ 
                template: '/app/account/login/login_modal.html',
                controller: 'MainCtrl',
                className: 'ngdialog-theme-default',
                scope: event.targetScope
              }).then(function (value) {
                // console.log('Modal promise resolved. Value: ', value);
              }, function(reason) {
                // console.log('Modal promise rejected. Reason: ', reason);
              });

              // ngDialog.openConfirm({
              //   template: '<div class="ngdialog-message">
              //               <h3>ngDialog modal example</h3>
              //               <p>The <code>.openConfirm()</code> function returns a promise that is resolved when confirmed and rejected when otherwise closed. Modal dialogs by default do not close when clicked outside the dialog or when hitting escape. This can ofcourse be overridden when opening the dialog.</p>
              //               <p>Confirm can take a value. Enter one here for example and see the console output: <input ng-model="confirmValue" /></p>
              //             </div>
              //             <div class="ngdialog-buttons">
              //               <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(confirmValue)">Confirm</button>
              //               <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog('button')">Cancel</button>
              //             </div>',
              //   plain: true
              // }).then(function (value) {
              //   console.log('Modal promise resolved. Value: ', value);
              // }, function (reason) {
              //   console.log('Modal promise rejected. Reason: ', reason);
              // });

            // $location.path('/');
          });
        }
      }
    });
  });
