'use strict';

 angular.module('doresolApp')
  .factory('Composite', function Composite($q,Memorial,File,User,ENV,$firebase,Story,Comment,Util) {

  var user = User.getCurrentUser();

  var setMyMemorials = function(userId){
    var dfd = $q.defer();

    var userRef = new Firebase(ENV.FIREBASE_URI + '/users');
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    
    // my own memorials
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

    // my member memorials
    var myMemberMemorialRef =  userRef.child(userId+'/memorials/members');
    var _myMemberMemorials = $firebase(myMemberMemorialRef).$asArray();

    _myMemberMemorials.$watch(function(event){
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

  var errorHandler = function(error){
    return $q.reject(error);
  }

  var _create_timeline_story = function(params) {
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    var timelineStoriesRef = memorialsRef.child(params.memorialId + '/timeline/stories');

    return $firebase(timelineStoriesRef).$set(params.key,true).then(function(value){
      return{
        key: value.name(),
        memorialId:params.memorialId
      }
    });
  }

  var _create_storyline_story = function(params){
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    var storylineStoriesRef = memorialsRef.child(params.memorialId + '/storyline/stories/'+ params.key);
    // return $firebase(storylineStoriesRef).$set(params.key,true);

    var forever = moment("99991231235959999", "YYYYMMDDHHmmssSSS").unix();
    var now = moment().unix();
    storylineStoriesRef.setWithPriority(true,forever - now + Util.getSequence());

    return params;
  }

  var createTimelineStory = function(memorialId, newStory) {
    if(newStory.file){
      return Story.create(newStory).then(File.createLocalFile).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
    }else{
      return Story.create(newStory).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
    }
  }

  var createStorylineStory = function(memorialId, newStory) {
    if(newStory.file){
      return Story.create(newStory).then(File.createLocalFile).then(_create_storyline_story, errorHandler);
    }else{
      return Story.create(newStory).then(_create_storyline_story, errorHandler);
    }
  }

  // Comment Related 
  var createComment = function(storyId, newComment) {
    var _create_comment = function(commentKey) {
      var storyRef = new Firebase(ENV.FIREBASE_URI + '/stories/' + storyId + '/comments');

      return $firebase(storyRef).$set(commentKey, true);
    }

    return Comment.create(storyId,newComment).then(_create_comment, errorHandler);
  }

  var addMember = function(object) {

    var _add_member = function(object){
      var memberRef = new Firebase(ENV.FIREBASE_URI + '/users/' + object.inviteeId + '/memorials/members');
      return $firebase(memberRef).$set(object.memorialId, true);
    }

    return Memorial.addMember(object.memorialId, object.inviteeId).then(_add_member, errorHandler);
  }
  
  return {
		createMemorial:createMemorial,
    setMyMemorials:setMyMemorials,

    // story 
    createTimelineStory:createTimelineStory,
    createStorylineStory:createStorylineStory,

    createComment:createComment,

    // member 
    addMember: addMember
	};
	
});
