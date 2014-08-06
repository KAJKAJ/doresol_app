'use strict';

angular.module('doresolApp')
  .factory('User', function User($firebase, $rootScope, $q, ENV) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/users');
  var users = $firebase(ref);
  
  var create = function(newUser) {
    var user = {
      id: newUser.id,
      email: newUser.email
    };

    return users.$set(newUser.uid, user);
  };

  var update = function(authUser, data) {
    return users.$update(authUser.uid, data);
  };

  var findById = function(user_id) {
    var userRef = users.$ref().child(user_id);
    return $firebase(userRef).$asObject();
  };

  // Memorial Related 
  var createMemorial = function(memorialId) {
    var uid = $rootScope.currentUser.uid;
    var memorialRef = users.$ref().child(uid + '/memorials/own/' + memorialId);
    var memorial = $firebase(memorialRef);

    return memorial.$set(memorialId);
  };

  // $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
  //   var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));

  //   query.$on('loaded', function () {
  //     setCurrentUser(query.$getIndex()[0]);
  //   });
  // });

  // $rootScope.$on('$firebaseSimpleLogin:logout', function() {
  //   delete $rootScope.currentUser;
  // });

  return {
    create: create,
    findById: findById,
    createMemorial: createMemorial
  };

});
