'use strict';

angular.module('doresolApp')
  .controller('StoryDetailCtrl', function ($scope,$stateParams,$state,Story,Composite,ENV,$firebase, User,Comment) {
  	$scope.story = Story.findById($scope.storyKey);
  	$scope.commentsObject = {};
    $scope.currentUser = User.getCurrentUser();
    $scope.currentUser.profile = User.getUserProfile($scope.currentUser);
    
    $scope.users = User.getUsersObject();
    $scope.newComment = {};
    
  	$scope.story.$loaded().then(function(value){
      value.$bindTo($scope, "story").then(function(){
      });

  		var storyCommentsRef = new Firebase(ENV.FIREBASE_URI + '/stories/'+value.$id + '/comments/');
  		var _comments = $firebase(storyCommentsRef).$asArray();
  		
  		var commentsRef = new Firebase(ENV.FIREBASE_URI + '/comments');

  		_comments.$watch(function(event){
	      switch(event.event){
	        case "child_removed":
	          // Memorial.removeMyMemorial(event.key);
	        break;
	        case "child_added":
	          var childRef = commentsRef.child(event.key);
	          var child = $firebase(childRef).$asObject();
	          child.$loaded().then(function(valueComment){
	          	valueComment.fromNow = moment(valueComment.created_at).fromNow();
	          	$scope.commentsObject[event.key] = valueComment;
	            User.setUsersObject(valueComment.ref_user);
	            
              valueComment.$bindTo($scope, "commentsObject['"+event.key+"']").then(function(){
              });   
	          });
	        break;
	      }
	    });

  	});

    $scope.addComment = function(comment){
      if(comment.body){
      	Composite.createComment($scope.storyKey, comment);
      	$scope.newComment = {};	
      }
    };

    $scope.deleteComment = function(storyKey, commentKey) {
      delete $scope.commentsObject[commentKey];
      Comment.removeCommentFromStory(storyKey, commentKey);
    };

  });
