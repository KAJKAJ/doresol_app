'use strict';

angular.module('doresolApp')
  .controller('StorylineCtrl', function ($scope,$stateParams,Memorial,ENV,$firebase,User) {
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    
    $scope.currentUser = User.getCurrentUser();
    $scope.currentUser.profile = User.getUserProfile($scope.currentUser);

    $scope.storiesObject = {};
    $scope.users = User.getUsersObject();
    $scope.priority = moment().unix();

    $scope.memorial.$loaded().then(function(value){
    	fetchStories($scope.priority);
    });

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
        	storyValue.fromNow = moment(storyValue.created_at).fromNow();
          $scope.storiesObject[storyValue.$id] = storyValue;
          User.setUsersObject(storyValue.ref_user);

          storyValue.$bindTo($scope, "storiesObject['"+storyValue.$id+"']").then(function(){
          	console.log(storyValue);
          	var currentStoryCommentsRef =  new Firebase(ENV.FIREBASE_URI + '/stories/'+storyValue.$id+'comments/');
          	var _comments = $firebase(currentStoryCommentsRef).$asArray();
          	_comments.$watch(function(event){
				      switch(event.event){
				        case "child_removed":
				          // $scope.storyCnt--;
				          break;
				        case "child_added":
					        var commentRef = new Firebase(ENV.FIREBASE_URI + '/comments/'+event.key);
				          var comment = $firebase(commentRef).$asObject();
				          comment.$loaded().then(function(commentValue){
				           // commentValue.fromNow = moment(commentValue.created_at).fromNow();
				          	// $scope.commentsObject[event.key] = commentValue;
				           //  User.setUsersObject(commentValue.ref_user);
				            
			            //   commentValue.$bindTo($scope, "commentsObject['"+event.key+"']").then(function(){
			            //   });  
				          });
				          break;
				        }
				    });
          });            
				});
			});
		}
  });
