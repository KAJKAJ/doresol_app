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
                var htmlElement = angular.element("<superbox-show></superbox-show>");
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
      scope: false,
      replace: true,
      templateUrl: "app/memorial/timeline/superbox_show.html",
      controller: function($scope){
        $scope.changed = function(){
          // console.log($scope);
        }
        // $scope.mapDetails = {};
        // $scope.map = {
        //   center: {
        //       latitude: 45,
        //       longitude: -73
        //   },
        //   zoom: 8
        // };
      }
      // link: function(scope, element, attrs) {
      //  });
      }
  })
  
  .directive('storymapApi',function(){
    return {
      restrict: 'E',
      scope:{
        story: '='
      },
      templateUrl: "app/memorial/storymap/storymap_api.html",
      controller: function($scope){
        $scope.mapDetails = {};
        if($scope.story.location){
          $scope.autocomplete = $scope.story.location.name;
        }

        var default_lat = 35.907757;
        var default_lon = 127.76692200000002 ;
        if($scope.story.location){
          if($scope.story.location.lat){
            default_lat = $scope.story.location.lat;
          }
          if($scope.story.location.lon){
            default_lon = $scope.story.location.lon;
          }
        }
        $scope.map = {
          center: {
              latitude: default_lat ,
              longitude: default_lon  
          },
          zoom: $scope.story.location ? 15 : 7
        };

        $scope.marker = {
          id:0,
          coords: {
              latitude: default_lat ,
              longitude: default_lon  
          },
          options: { draggable: false }
        }

        $scope.$watch('mapSearchDetails',function(value){
          if(value){
            var lon = value.geometry.location.B;
            var lat = value.geometry.location.k;

            $scope.map.center.latitude = lat;
            $scope.map.center.longitude = lon;

            //marker
            $scope.marker.coords.latitude = lat;
            $scope.marker.coords.longitude = lon;

            $scope.story.location.lat = lat;
            $scope.story.location.lon = lon;
            $scope.story.location.name = $scope.autocomplete;
          }
        });
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

