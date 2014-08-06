'use strict';

angular.module('doresolApp')
  .factory('User', function User($firebase, $rootScope, $q, ENV) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/users');
  var users = $firebase(ref);
  
  var currentUser = null;

  var getCurrentUserFromFirebase = function(userId){
    var dfd = $q.defer();
    if(currentUser == null){
      var user = findById(userId);

      user.$loaded().then(function(value) {
        currentUser = value;
        dfd.resolve(currentUser);
      },function(error){
        dfd.reject(error);
      });
    }else{
      dfd.resolve(currentUser);
    }
    return dfd.promise;
  };

  var setCurrentUser = function(user){
    if(user){
      var user = findById(user.uid);

      user.$loaded().then(function(value) {
        currentUser = value;
      },function(error){
        currentUser = null;
      });
    }else{
      currentUser = null;
    }
  };

  var create = function(newUser) {
    var user = {
      uid: newUser.uid,
      id: newUser.id,
      email: newUser.email
    };

    return users.$set(newUser.uid, user);
  };

  var update = function(userId, data) {
    return users.$update(userId, data);
  };

  var findById = function(userId) {
    var userRef = users.$ref().child(userId);
    return $firebase(userRef).$asObject();
  };

  var getCurrentUser = function(){
    return currentUser;
  };

  // Memorial Related 
  var createMemorial = function(memorialId) {
    var uid = currentUser.uid;
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
    createMemorial: createMemorial,
    getCurrentUser:getCurrentUser,
    setCurrentUser:setCurrentUser,
    getCurrentUserFromFirebase:getCurrentUserFromFirebase,
    update:update
  };

});
