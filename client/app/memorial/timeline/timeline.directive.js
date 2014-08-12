'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout) {
    return {
      restrict: 'C',
      scope:{
        story: '=story',
      },
      templateUrl: 'app/memorial/timeline/superbox_list.html',
    
      link: function(scope, element, attrs) {
        element.on('click', function() {
          if(scope.$root.superboxToggled == scope.story.$$hashKey){
            $timeout(function(){
              scope.$root.superboxToggled = false;
            });
          }else{
            $timeout(function(){
              scope.$root.superboxToggled = scope.story.$$hashKey;    
            });     
          }

          // scope.$apply();
          
          // $('html, body').animate({
          //   scrollTop:superbox.position().top - currentimg.width()
          // }, 'medium');
        });
      }
    };
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

