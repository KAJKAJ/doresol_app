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
          	// var commentsRef = new Firebase(ENV.FIREBASE_URI + '/comments');
          	// var childRef = storiesRef.child(event.key);
	          // var child = $firebase(childRef).$asObject();
	          // child.$loaded().then(function(value){
	          //   // $scope.timelineStories[event.key] = value;
	          //   if($scope.storiesArray[value.ref_era] == undefined) {
	          //     $scope.storiesArray[value.ref_era] = [];
	          //     $scope.storiesObject[value.ref_era] = {};
	          //   };
	          //   $scope.storiesArray[value.ref_era].push(event.key);
	          //   $scope.storiesObject[value.ref_era][event.key] = value;  
	            
	          //   // new object case delete it
	          //   if(value.newStory) {
	          //     delete $scope.storiesObject[value.ref_era][value.tempKey];
	          //     var index = $scope.storiesArray[value.ref_era].indexOf(value.tempKey);
	          //     $scope.storiesArray[value.ref_era].splice(index, 1);
	          //   }
	            
	          //   $scope.storiesArray[value.ref_era].sort(function(aKey,bKey){
	          //     var aValue = $scope.storiesObject[value.ref_era][aKey];
	          //     var bValue = $scope.storiesObject[value.ref_era][bKey];
	          //     var aStartDate = moment(aValue.startDate).unix();
	          //     var bStartDate = moment(bValue.startDate).unix();
	          //     return aStartDate > bStartDate ? 1 : -1;
	          //   });

	          //   // $scope.stories[value.ref_era][event.key] = true;

	          //   value.$bindTo($scope, "storiesObject['"+value.ref_era+"']['"+event.key+"']").then(function(){
	          //     $scope.storiesObject[value.ref_era][event.key].newStory = false;
	          //     $scope.storyCnt++;
	          //     // console.log($scope.storiesObject[value.ref_era][event.key]);
	          //   });            
	          // });
          });            
				});
			});
		}
  });
