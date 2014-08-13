'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout,$compile,$http) {
    return {
      restrict: 'C',
      scope:{
        story: '=story',
      },
      templateUrl: 'app/memorial/timeline/superbox_list.html',
      link: function(scope, element, attrs) {
        element.on('click', function() {
          angular.element('.superbox-show').remove();

          if(scope.$root.superboxToggled == scope.story.$$hashKey){
            $timeout(function(){
              scope.$root.superboxToggled = false;
            });
          } else{
            $timeout(function(){
              scope.$root.superboxToggled = scope.story.$$hashKey;

              var htmlElement = {};
              $http({method: 'GET', url: 'app/memorial/timeline/superbox_show.html'}).
                  success(function(data, status, headers, config) {
                    element.after(data);
                    $compile(element.next().contents())(scope);
                  }).
                  error(function(data, status, headers, config) {
                  });
            });     
          }

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

