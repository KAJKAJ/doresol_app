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
            value.own = true;
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
            value.own = false;
            Memorial.addMyMemorial(event.key,value);
          });
        break;
      }
    });

    dfd.resolve(true);
    return dfd.promise;
  };

  var createMemorial = function(memorial) {
    var _create_memorial = function(memorial) {
      return Memorial.create(memorial);
    };

    if(memorial.file){
      return _create_memorial(memorial).then(File.createLocalFile).then(User.createMemorial, errorHandler);
    }else{
      return _create_memorial(memorial).then(User.createMemorial, errorHandler);
    }
  }

  var changeMemorialProfileImage = function(memorial){
    var _update_memorial_profile_image = function(memorial) {
      return Memorial.update(memorial.$id,{file:memorial.file}).then(function(value){
        return {
          fileParentPath: value.toString(),
          fileUrl:  memorial.file.url
        }
      });
    };

    return _update_memorial_profile_image(memorial).then(File.createLocalFile, errorHandler);
  }

  var updateUserProfileWithFile = function(user){
    var _updateNickName = function(user) {
      return User.update(user.uid,{profile:user.profile}).then(function(value){
        var userRef = new Firebase(ENV.FIREBASE_URI + '/users/'+user.uid+'/profile/');
        return {
          fileParentPath: ENV.FIREBASE_URI + 'users/'+user.uid+'/profile',
          fileUrl: user.profile.file.url
        }
      });
    };

    return _updateNickName(user).then(File.createLocalFile, errorHandler);
  }

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
      // return Story.create(newStory).then(File.createLocalFile).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
      return Story.create(newStory).then(File.createLocalFile).then(_create_timeline_story, errorHandler);
    }else{
      // return Story.create(newStory).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
      return Story.create(newStory).then(_create_timeline_story, errorHandler);
    }
  }

  var _create_storymap_story = function(params) {
    var memorialsRef = new Firebase(ENV.FIREBASE_URI + '/memorials');
    var timelineStoriesRef = memorialsRef.child(params.memorialId + '/storymap/stories');

    return $firebase(timelineStoriesRef).$set(params.key,true).then(function(value){
      return{
        key: value.name(),
        memorialId:params.memorialId
      }
    });
  }

  var createStorymapStory = function(memorialId, newStory) {
    if(newStory.file){
      // return Story.create(newStory).then(File.createLocalFile).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
      return Story.create(newStory).then(File.createLocalFile).then(_create_storymap_story, errorHandler);
    }else{
      // return Story.create(newStory).then(_create_timeline_story).then(_create_storyline_story, errorHandler);
      return Story.create(newStory).then(_create_storymap_story, errorHandler);
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

  var addWaiting = function(object) {
    var _add_waiting = function(object){
      var waitingRef = new Firebase(ENV.FIREBASE_URI + '/users/' + object.requesterId + '/memorials/waitings');
      return $firebase(waitingRef).$set(object.memorialId, true);
    }
    return Memorial.addWaiting(object.memorialId, object.requesterId).then(_add_waiting, errorHandler);
  }

  var removeWaiting = function(object) {
   var _remove_waiting = function(object){
      var waitingRef = new Firebase(ENV.FIREBASE_URI + '/users/' + object.requesterId + '/memorials/waitings');
      return $firebase(waitingRef).$remove(object.memorialId);
    }

    return Memorial.removeWaiting(object.memorialId, object.requesterId).then(_remove_waiting, errorHandler); 
  }

  return {
		createMemorial:createMemorial,
    setMyMemorials:setMyMemorials,
    changeMemorialProfileImage:changeMemorialProfileImage,

    // story 
    createTimelineStory:createTimelineStory,
    createStorylineStory:createStorylineStory,
    createStorymapStory:createStorymapStory,

    createComment:createComment,

    // member 
    addMember: addMember,
    updateUserProfileWithFile:updateUserProfileWithFile,

    addWaiting: addWaiting,
    removeWaiting: removeWaiting
	};
	
});
