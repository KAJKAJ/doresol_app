'use strict';

angular.module('doresolApp')
  .controller('StoryCtrl', function ($scope,$stateParams,$state,Story,Composite) {
  	$scope.story = Story.findById($scope.storyKey);
console.log($scope.storyKey);
    $scope.addComment = function(comment){
      console.log(comment);
      if(comment.body){
      	Composite.createComment($scope.storyKey, comment);
      	$scope.comment = null;	
      }
    };

  });
