'use strict';

angular.module('doresolApp')
  .controller('StoryCtrl', function ($scope,$stateParams,$state,Story,Composite,ENV,$firebase, User) {
  	$scope.story = Story.findById($scope.storyKey);
  	$scope.commentsObject = {};

  	$scope.story.$loaded().then(function(value){
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
	          child.$loaded().then(function(value){
	            $scope.commentsObject[event.key] = value;
	            User.setUsersObject(value.ref_user);
	            $scope.users = User.getUsersObject();
	          });
	        break;
	      }
	    });

  	});

    $scope.addComment = function(comment){
      if(comment.body){
      	Composite.createComment($scope.storyKey, comment);
      	$scope.comment = null;	
      }
    };

  });
