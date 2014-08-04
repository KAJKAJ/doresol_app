'use strict';

angular.module('doresolApp')
  .factory('Auth', function Auth($location, $firebase, $rootScope, $http, User, $cookieStore, $q, ENV, $firebaseSimpleLogin) {
    var authService = $firebaseSimpleLogin(new Firebase(ENV.FIREBASE_URI));
    var userService = $firebase(new Firebase(ENV.FIREBASE_URI + '/users'));

    var currentUser = {};

    var getCurrentUser = function(){
      if(!currentUser){
        authService.$getCurrentUser()
          .then(function (value){
            currentUser = value;
          }
        );
      }

      return currentUser;
    };

    var createUser =  function(user) {
    	var deferred = $q.defer();
    	authService.$createUser(user.email,user.password)
    		.then(function(value){
          // console.log(value);
          userService.$set(value.uid, {id:value.id, email: user.email})
          .then(function(value) {
            deferred.resolve(value);
          }, function(error) {
            deferred.reject(error);
          });
          
    		}, function(error) {
          deferred.reject(error);
    		});
    	 return deferred.promise;
    };

    var login = function(user){
      var deferred = $q.defer();
      authService.$login('password',{email:user.email, password:user.password,rememberMe: true})
        .then(function(value){
          // console.log(value);
          currentUser = value;
          deferred.resolve(currentUser);
        },function(error){
          deferred.reject(error);
        }
      );

      return deferred.promise;
    };

    var loginFb = function(user) {
      var deferred = $q.defer();
      authService.$login('facebook', {scope: 'user_photos, email, user_likes',rememberMe: true} ).then(function(value) {
        currentUser = value;
        userService.$update(value.uid, {
          id: value.id,
          name:  value.displayName,
          thirdPartyUserData: value.thirdPartyUserData
        },function(error){
          if(!error){
            deferred.resolve(value);
          }else{
            deferred.reject(error);
          }
        });

      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    };

    var loginOauth = function(provider){
      switch(provider){
        case 'facebook':
          loginFb().then( function (value){
            // console.log(value);
            $location.path('/mydoresol');
          } ,function(error){
            console.log(error);
          });
        break;
      }
    };

    var isLoggedIn = function() {
      return currentUser.hasOwnProperty('uid');
    };

    var logout = function() {
      currentUser = {};
    };

    currentUser = getCurrentUser();
    
    return {

      login: login,

      loginOauth: loginOauth,

      logout: logout,

      createUser: createUser,

      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      getCurrentUser: getCurrentUser,

      isLoggedIn: isLoggedIn,

      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      // /**
      //  * Get auth token
      //  */
      // getToken: function() {
      //   return $cookieStore.get('token');
      // }
    };
  });
