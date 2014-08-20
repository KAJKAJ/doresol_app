'use strict';

 angular.module('doresolApp')
  .factory('Composite', function Memorial($q,Memorial,File,User,ENV,$firebase,Story,Comment) {

  var user = User.getCurrentUser();

  var setMyMemorials = function(userId){
    var dfd = $q.defer();

    var userRef = new Firebase(ENV.FIREBASE_URI + '/users');
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    var myMemorialRef =  userRef.child(userId+'/memorials/own');
    var _myMemorials = $firebase(myMemorialRef).$asArray();

    _myMemorials.$watch(function(event){
      switch(event.event){
        case "child_removed":
          Memorial.removeMyMemorial(event.key);
        break;
        case "child_added":
          var childRef = memorialsRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            Memorial.addMyMemorial(event.key,value);
          });
        break;
      }
    });

    dfd.resolve(true);
    return dfd.promise;
  };

  var createMemorial = function(memorial) {
    var errorHandler = function(error){
      return $q.reject(error);
    };

    var _create_memorial = function(memorial) {
      return Memorial.create(memorial);
    };

    if(memorial.file){
      return _create_memorial(memorial).then(File.createLocalFile).then(User.createMemorial, errorHandler);
    }else{
      return _create_memorial(memorial).then(User.createMemorial, errorHandler);
    }
  };

  var createStory = function(memorialId, newStory) {
    var errorHandler = function(error){
      return $q.reject(error);
    };

    // save story -> localfile -> memorial 
    var _create_story = function(params) {
      var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
      var timelineStoriesRef = memorialsRef.child(memorialId + '/timeline/stories');

      return $firebase(timelineStoriesRef).$set(params.key,true);
    };
    
    if(newStory.file){
      return Story.create(newStory).then(File.createLocalFile).then(_create_story, errorHandler);
    }else{
      return Story.create(newStory).then(_create_story, errorHandler);
    }
  };


  // Comment Related 
  var createComment = function(storyId, newComment) {
    var errorHandler = function(error) {
      return $q.reject(error);
    };

    var _create_comment = function(commentKey) {
      console.log(storyId);
      var storyRef = new Firebase(ENV.FIREBASE_URI + '/stories/' + storyId + '/comments');

      return $firebase(storyRef).$set(commentKey, true);
    };

    return Comment.create(storyId,newComment).then(_create_comment, errorHandler);
  };

  
  return {
		createMemorial:createMemorial,
    setMyMemorials:setMyMemorials,

    // story 
    createStory:createStory,

    createComment:createComment
	};
	
});
