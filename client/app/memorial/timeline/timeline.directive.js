'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout,$compile,$http) {
    return {
      restrict: 'C',
      scope:{
        story: '=story',
        storyKey: '=storyKey'
      },
      templateUrl: 'app/memorial/timeline/superbox_list.html',
      link: function(scope, element, attrs) {
        element.on('click', function() {
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

        });
      }
    };
  })

  .directive('superboxShow', function () {
    return {
      restrict: 'E',
      scope: false,
      replace: true,
      templateUrl: "app/memorial/timeline/superbox_show.html",
      // link: function(scope, element, attrs) {
      //  });
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

