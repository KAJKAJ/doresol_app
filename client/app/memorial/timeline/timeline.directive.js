'use strict';

angular.module('doresolApp')
  .directive('superboxList', function ($timeout,$compile) {
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
              var htmlElement = '<div class="superbox-show" style="display: block; color:white">            <div class="row">                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">                     <div ng-show="story.new_story">                      <!-- detail info -->                      <div ng-show="story.file.type == \'image\'">                        <img flow-image="story.file" class="img-responsive">                       </div>                      <div ng-show="story.file.type == \'video\'">                        <video flow-video="story.file" controls>                       </div>                    </div>                  </div>                  <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6">                    <a href="#" editable-text="story.headline"> {{ story.headline || "제목을 입력하세요" }} </a>                    <hr/>                      <div>                      <a href="#" editable-textarea="story.text" e-rows="7" e-cols="40" class="optional-text">                        {{ story.text || "설명이 필요하면 적어주세요" }}                      </a>                    </div>                  </div>              </div>            </div>';
              element.after(htmlElement);
              $compile(element.next().contents())(scope);
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

