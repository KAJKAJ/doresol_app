'use strict';

angular.module('doresolApp')
  .controller('StorylineCtrl', function ($scope,$stateParams,Memorial,ENV,$firebase,User,Composite,Comment,Util) {
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    
    $scope.currentUser = User.getCurrentUser();
    $scope.currentUser.profile = User.getUserProfile($scope.currentUser);

    $scope.storiesObject = [];
    $scope.users = User.getUsersObject();
    $scope.priority = moment().unix();

    $scope.commentsObject = {};
    $scope.newComment = {};
    $scope.newStory = {};
    $scope.newStory.public = true;

    $scope.memorial.$loaded().then(function(value){
    	fetchStories($scope.priority);
    });

    $scope.fetchMoreStories = function(){
    	fetchStories($scope.priority);
    }

		var fetchStories = function(priority){
			var storiesRef = new Firebase(ENV.FIREBASE_URI + '/stories');

			var currentStorylineStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/storyline/stories/');
			var _storylineStories = currentStorylineStoriesRef.startAt(priority+1).limit(10);

			_storylineStories.on('child_added', function(value) { 
				var priority = value.getPriority();

				if(priority > $scope.priority){
					$scope.priority = priority;
				}

				var childRef = storiesRef.child(value.name());
        var child = $firebase(childRef).$asObject();
        child.$loaded().then(function(storyValue){
        	if(!$scope.commentsObject[storyValue.$id]){
	          $scope.commentsObject[storyValue.$id] = {};
	        }
        	storyValue.fromNow = moment(storyValue.created_at).fromNow();
          $scope.storiesObject.push(storyValue);
          var storyCnt = $scope.storiesObject.length;
          User.setUsersObject(storyValue.ref_user);

          storyValue.$bindTo($scope, "storiesObject["+(storyCnt-1)+"]").then(function(){
          	var currentStoryCommentsRef =  new Firebase(ENV.FIREBASE_URI + '/stories/'+storyValue.$id+'/comments/');
          	var _comments = $firebase(currentStoryCommentsRef).$asArray();
          	_comments.$watch(function(event){
				      switch(event.event){
				        case "child_removed":
				          if($scope.commentsObject[storyValue.$id][event.key]){
				            delete $scope.commentsObject[storyValue.$id][event.key];
				        	}
				          break;
				        case "child_added":
				          var commentRef = new Firebase(ENV.FIREBASE_URI + '/comments/'+event.key);
				          var comment = $firebase(commentRef).$asObject();
				          comment.$loaded().then(function(commentValue){
				            commentValue.fromNow = moment(commentValue.created_at).fromNow();
				          	$scope.commentsObject[storyValue.$id][event.key] = commentValue;
				            User.setUsersObject(commentValue.ref_user);
				            
			              commentValue.$bindTo($scope, "commentsObject['"+storyValue.$id+"']['"+event.key+"']").then(function(){
			              });  
			            });
				          break;
				        }
				    });
          });            
				});
			});
		}

		$scope.addComment = function(storyKey,comment){
      if(comment.body){
      	Composite.createComment(storyKey, comment);
      	$scope.newComment = {};	
      }
    }

    $scope.deleteComment = function(storyKey, commentKey) {
      delete $scope.commentsObject[storyKey][commentKey];
      Comment.removeCommentFromStory(storyKey, commentKey);
    }

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    }

    $scope.flowFilesAdded = function($files){
    	angular.forEach($files, function(value, key) {
        value.type = value.file.type.split("/")[0];
      
        var startDate = moment(value.file.lastModifiedDate).format("YYYY-MM-DD");
        $scope.newStory.file = value;
      });
		}

    $scope.removeFlowFile = function(){
    	$scope.newStory.file = null;
    }

    $scope.createNewStory = function(form){
    	if(form.$valid){
    		if($scope.newStory.file){
		    	var file = {
	          type: $scope.newStory.file.type,
	          location: 'local',
	          url: '/tmp/' + $scope.newStory.file.uniqueIdentifier,
	          updated_at: moment().toString()
	        }
	        $scope.newStory.file = file;
        }

        $scope.newStory.ref_memorial = $scope.memorialKey;
        $scope.newStory.ref_user = $scope.currentUser.uid;

        Composite.createStorylineStory($scope.memorialKey,$scope.newStory).then(function(value){
        	$scope.newStory = {};
        	$scope.newStoryForm.$setPristine();
        	console.log(value);
        }, function(error){
          console.log(error);
        });
	    }
    }
  });
