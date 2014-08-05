'use strict';

angular.module('doresolApp')
  .factory('Auth', function Auth($location, $rootScope, $q, User, ENV, $firebaseSimpleLogin) {
    var auth = $firebaseSimpleLogin(new Firebase(ENV.FIREBASE_URI));
    $rootScope.currentUser = {};

    var register =  function(user) {
    	var _register = function() {
        return auth.$createUser(user.email,user.password).then( function (value){
          value.email = user.email;
          return value;
        });
      };

      return _register(user).then(User.create);
    };

    var getCurrentUser = function() {
      if(!isLoggedIn()) {
        auth.$getCurrentUser().then(function(value) {
          setCurrentUser(value);
          return $rootScope.currentUser;
        });
      }
      return $rootScope.currentUser;
    };

    var setCurrentUser = function(authUser) {
      $rootScope.currentUser = authUser;
    };

    var login = function(user){
      var deferred = $q.defer();
      auth.$login('password',{email:user.email, password:user.password,rememberMe: true}).then(function(value) {

        setCurrentUser(value);
        deferred.resolve(value);

      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var loginFb = function() {
      var deferred = $q.defer();
      auth.$login('facebook', {scope: 'user_photos, email, user_likes',rememberMe: true}).then(function(value) {
        setCurrentUser(value);
        deferred.resolve(value);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var loginOauth = function(provider){
      switch(provider){
        case 'facebook':
          return loginFb().then( function (){
            $location.path('/mydoresol');
          } ,function(error){
            console.log(error);
          });
        break;
      }
    };

    var isLoggedIn = function() {
      return $rootScope.currentUser.hasOwnProperty('uid');
    };

    var logout = function() {
      auth.$logout();
      $rootScope.currentUser = {};
    };

    $rootScope.currentUser = getCurrentUser();

    return {

      register: register,

      login: login,

      loginOauth: loginOauth,

      logout: logout,

      isLoggedIn: isLoggedIn

      // isAdmin: function() {
      //   return currentUser.role === 'admin';
      // },

      // changePassword: function(oldPassword, newPassword, callback) {
      //   var cb = callback || angular.noop;

      //   return User.changePassword({ id: currentUser._id }, {
      //     oldPassword: oldPassword,
      //     newPassword: newPassword
      //   }, function(user) {
      //     return cb(user);
      //   }, function(err) {
      //     return cb(err);
      //   }).$promise;
      // }
    };
  });
