'use strict';

angular.module('doresolApp')
  .factory('Auth', function Auth($location, $firebase, $rootScope, $http, User, $cookieStore, $q, ENV, $firebaseSimpleLogin) {
    var authService = $firebaseSimpleLogin(new Firebase(ENV.FIREBASE_URI));
    var userService = new Firebase(ENV.FIREBASE_URI + '/users');

    var currentUser = null;

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

			userService.child('email:'+user.email).update({id: user.email, password: user.password});
			console.log(error);
		}, function(error) {
		});
	return deferred.promise;
    };

    var login = function(user){
      var deferred = $q.defer();
      authService.$login('password',{email:user.email, password:user.password})
        .then(function(value){
          // console.log(value);
          currentUser = value;
          deferred.resolve(currentUser);
        },function(error){
          deferred.reject(error);
        }
      );

      return deferred.promise;

      // return authService.$login('password',{email:user.email, password:user.password})
      //         .then(function(value){
      //           currentUser = value;
      //         });
    };

    var loginFb = function(user) {
      authService.$login('facebook', {scope: 'user_photos, email, user_likes'} ).then(function() {
		userService.child(authService.user.id).update({
			fb_uid: authService.user.uid
		});
	}, function(error) {
		console.log(error);
	});
    };

    currentUser = getCurrentUser();

    
    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: login,

      loginFb: loginFb,

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       */
      createUser: createUser,

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
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

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: getCurrentUser,

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
