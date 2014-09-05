'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout,$compile,$http) {
    return {
      restrict: 'C',
      scope:{
        story: '=story',
        storyKey: '=storyKey',
        removeSelectedStory: '&'
      },
      templateUrl: 'app/memorial/timeline/superbox_list.html',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          if(!scope.isRemoveClicked){
            angular.element('.superbox-show').remove();

            if(scope.$root.superboxToggled == scope.storyKey){
              $timeout(function(){
                scope.$root.superboxToggled = false;
              });
            } else{
              $timeout(function(){
                scope.$root.superboxToggled = scope.storyKey;
                var htmlElement = angular.element("<superbox-show story='story'></superbox-show>");
                element.after(htmlElement);
                $compile(element.next()[0])(scope);
              }); // timeout
            } // else 
          }else{
            scope.isRemoveClicked = false;
          }
        });
      },
      controller: function($scope){
        $scope.removeStory = function(){
          $scope.isRemoveClicked = true;
          $scope.removeSelectedStory();
        }
      }
    };
  })

  .directive('superboxShow', function () {
    return {
      restrict: 'E',
      scope: {
        story: '=story'
      },
      replace: true,
      templateUrl: "app/memorial/timeline/superbox_show.html",
      controller: function($scope){
        console.log($scope.story);
          // var mapOptions = {
        //     zoom: 8,
        //     center: new google.maps.LatLng(-34.397, 150.644)
        //   };
        //   map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        
        // var mapOptions = {
        //     zoom: 8,
        //     center: new google.maps.LatLng(-34.397, 150.644)
        //   };
        //   map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
      }
    }
  })
  // Slot List Directive
  .directive('slotList', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: "app/memorial/timeline/slot_list.html",
      // link: function(scope, element, attrs) {
      //  });
      }
  })

  .directive('storyDetail', function () {
    return {
      restrict: 'E',
      scope: {
        storyKey:'@',
        addComment: '&'
      },
      // replace: true,
      templateUrl: "app/memorial/timeline/story_detail.html",
      controller:'StoryDetailCtrl'
    }
  })

  .directive('storyList', function () {
    return {
      restrict: 'E',
      scope: false,
      templateUrl: "app/memorial/timeline/story_list.html",
      // link: function(scope, element, attrs) {
      //   element.on('click',function(){
      //     scope.selectedEra = 'new';
      //   });
      // }
    }
  });

