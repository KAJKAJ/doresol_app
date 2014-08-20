'use strict';

angular.module('doresolApp')
  .factory('Comment', function Comment($firebase, $q, ENV, User) {

  var ref = new Firebase(ENV.FIREBASE_URI + '/comments');
  var comments = $firebase(ref);
  
  var create = function(storyId, newComment) {
    console.log(storyId);
    newComment.created_at = moment().toString();
    newComment.updated_at = newComment.created_at;
    newComment.ref_user = User.getCurrentUser().uid;
    newComment.ref_story = storyId;

    return comments.$push(newComment).then(function(value){
      return value.name();
    });
  };

  var update = function(commentKey, comment) {
    comment.updated_at = moment().toString();
    return comments.$update(commentKey, comment);
  };

  var findById = function(commentKey) {
    var commentRef = ref.child(commentKey);
    return $firebase(storyRef).$asObject();
  };

  var remove = function(commentKey) {
    return users.$remove(storyKey);
  };

  return {
    create: create,
    update: update,
    findById: findById,
    remove: remove
  };

});
