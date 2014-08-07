'use strict';

angular.module('doresolApp')
  .factory('User', function User($firebase, $rootScope, $q, $timeout, ENV, MyMemorial) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/users');
  var users = $firebase(ref);
  
  var currentUser = null;

  var getCurrentUserFromFirebase = function(userId){
    var dfd = $q.defer();
    if(currentUser == null){
      var user = findById(userId);

      user.$loaded().then(function(value) {

        if(user.hasOwnProperty('uid')) {
          setCurrentUser(value);
          dfd.resolve(currentUser);
        } else {
          dfd.reject('user is deleted');  
        }
      },function(error){
        dfd.reject(error);
      });
    }else{
      dfd.resolve(getCurrentUser());
    }
    return dfd.promise;
  };

  var setCurrentUser = function(user){
    if(user){
      currentUser = user;

      // var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
      // var myMemorialRef =  ref.child(user.uid+'/memorials/own');

      // myMemorialRef.on("child_added", function(value) {
      //   var oneMemorial = $firebase(memorialsRef.child(value.name())).$asObject();
      //   oneMemorial.$watch(function() {
      //     $timeout(function(){
      //       MyMemorial.addMyMemorial(oneMemorial.$id,oneMemorial);
      //     },0);
      //   });
      // });
      // myMemorialRef.on("child_removed", function(value) {
      //   $timeout(function(){
      //     MyMemorial.removeMyMemorial(value.name());
      //   },0);
      // });

      var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
      var myMemorialRef =  ref.child(user.uid+'/memorials/own');
      var myMemorials = $firebase(myMemorialRef).$asArray();

      myMemorials.$watch(function(event){
        switch(event.event){
          case "child_removed":
            MyMemorial.removeMyMemorial(event.key);
          break;
          case "child_added":
            var childRef = memorialsRef.child(event.key);
            var child = $firebase(childRef).$asObject();
            child.$loaded().then(function(value){
              MyMemorial.addMyMemorial(event.key,value);
            });
          break;
        }
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
  var createMemorial = function(params) {
    var uid = currentUser.uid;
    var ownMemorialRef = users.$ref().child(uid + '/memorials/own/' + params.key);
    var memorial = $firebase(ownMemorialRef);

    return memorial.$set(true);
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
