'use strict';

angular.module('doresolApp')
  .factory('Story', function Story($firebase, $q, $timeout, ENV) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/stories');
  var stories = $firebase(ref);
  
  var create = function(newStory) {
    newStory.created_at = moment().toString();
    newStory.updated_at = newStory.created_at;

    return stories.$push(newStory).then(function(value){
      return {
        key: value.name(),
        memorialId: newStory.ref_memorial,
        fileParentPath: newStory.file?value.toString():null,
        fileUrl:  newStory.file?newStory.file.url:null
      }
    });
  }

  var update = function(storyKey, story) {
    // newStory.updated_at = moment().toString();
    return stories.$update(storyKey, story);
  }

  var findById = function(storyKey) {
    var storyRef = ref.child(storyKey);
    return $firebase(storyRef).$asObject();
  }

  var remove = function(storyKey) {
    return stories.$remove(storyKey);
  }
  
  var removeStoryFromTimeline = function(memorialId,storyId){
    var memorialRef = new Firebase(ENV.FIREBASE_URI + '/memorials/'+memorialId+'/timeline/stories');
    return $firebase(memorialRef).$remove(storyId);
  }

  var removeStoryFromStoryline = function(memorialId,storyId){
    var memorialRef = new Firebase(ENV.FIREBASE_URI + '/memorials/'+memorialId+'/storyline/stories');
    return $firebase(memorialRef).$remove(storyId);
  }

  var removeStory = function(story){
    //TODO: delete related files??
    
    return removeStoryFromTimeline(story.ref_memorial,story.$id).then(function(){
      removeStoryFromStoryline(story.ref_memorial,story.$id).then(function(){
        remove(story.$id);
      });
    });
  }

  return {
    create: create,
    update: update,
    findById: findById,
    remove: remove,
    removeStoryFromTimeline:removeStoryFromTimeline,
    removeStoryFromStoryline:removeStoryFromStoryline,
    removeStory:removeStory
  };

});
