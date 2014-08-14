'use strict';

 angular.module('doresolApp')
  .factory('MyMemorial', function Memorial($q,Memorial,File,User,ENV,$firebase,Story) {

  var myMemorials = {};
  var currentMemorial = null;

  var setMyMemorials = function(userId){
    var dfd = $q.defer();

    var userRef = new Firebase(ENV.FIREBASE_URI + '/users');
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    var myMemorialRef =  userRef.child(userId+'/memorials/own');
    var _myMemorials = $firebase(myMemorialRef).$asArray();

    _myMemorials.$watch(function(event){
      switch(event.event){
        case "child_removed":
          removeMyMemorial(event.key);
        break;
        case "child_added":
          var childRef = memorialsRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            addMyMemorial(event.key,value);
          });
        break;
      }
    });

    dfd.resolve(true);
    return dfd.promise;
  };

  var removeStoryFromTimeline = function(memorialId,storyId){
    var memorialRef = new Firebase(ENV.FIREBASE_URI + '/memorials/'+memorialId+'/timeline/stories');
    $firebase(memorialRef).$remove(storyId);
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


  var setCurrentMemorial = function(memorialId){
    currentMemorial = Memorial.findById(memorialId);
  };

  var getCurrentMemorial = function(){
    return currentMemorial;
  };

  var addMyMemorial = function(key,value){
  	myMemorials[key] = value;
  };

  var removeMyMemorial = function(key){
  	delete myMemorials[key];
  };

  var getMyMemorials = function(){
  	return myMemorials;
  };

  var getMyMemorial = function(memorialId) {
    return myMemorials[memorialId];
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

  return {
		addMyMemorial:addMyMemorial,
		removeMyMemorial:removeMyMemorial,
		getMyMemorials:getMyMemorials,
    getMyMemorial:getMyMemorial,
    setCurrentMemorial:setCurrentMemorial,
    getCurrentMemorial:getCurrentMemorial,
    createMemorial:createMemorial,
    setMyMemorials:setMyMemorials,

    // story 
    createStory:createStory,
    removeStoryFromTimeline:removeStoryFromTimeline
	};
	
});
