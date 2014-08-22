'use strict';

angular.module('doresolApp')
  .controller('StorylineCtrl', function ($scope,$stateParams,Memorial,ENV,$firebase) {
    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();
    
    $scope.storiesObject = {};

    $scope.memorial.$loaded().then(function(value){
      console.log(value);
      
      var storiesRef = new Firebase(ENV.FIREBASE_URI + '/stories');
	    var currentStorylineStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/storyline/stories/');
	    var _storylineStories = $firebase(currentStorylineStoriesRef).$asArray();

	    _storylineStories.$watch(function(event){
	      switch(event.event){
	        case "child_removed":
	          // removeMyMemorial(event.key);
	          break;
	        case "child_added":
	          var childRef = storiesRef.child(event.key);
	          var child = $firebase(childRef).$asObject();
	          child.$loaded().then(function(value){
	            $scope.storiesObject[event.key] = value;

	            value.$bindTo($scope, "storiesObject['"+event.key+"']").then(function(){
	            });            
	            console.log($scope.storiesObject);
	          });
	          
	        break;
	      }
	    });

    });
  });
