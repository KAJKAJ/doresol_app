'use strict';

angular.module('doresolApp')
  .factory('Story', function Story($firebase, $q, $timeout, ENV) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/stories');
  var stories = $firebase(ref);
  
  var create = function(newStory) {
    return stories.$push(newStory).then(function(value){
      return {
        key: value.name(),
        fileParentPath: newStory.file?value.toString():null,
        fileUrl:  newStory.file?newStory.file.url:null
      }
    });
  };

  var update = function(storyKey, story) {
    return users.$update(storyKey, story);
  };

  var findById = function(storyKey) {
    var storyRef = ref.child(userId);
    return $firebase(storyRef).$asObject();
  };

  var remove = function(storyKey) {
    return users.$remove(storyKey);
  };

  return {
    create: create,
    update: update,
    findById: findById,
    remove: remove
  };

});
