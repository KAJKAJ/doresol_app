'use strict';

angular.module('doresolApp')
  .directive('superboxList', function () {
    return {
      restrict: 'C',
      scope:{},
      templateUrl: 'app/memorial/timeline/superbox_list.html',
    
      link: function(scope, element, attrs) {
        element.on('click', function() {
          if(scope.$parent.superboxToggled == scope.$id){
            scope.$parent.superboxToggled = null;
            element.removeClass("active");
            element.next().css('display','none');
          }else{
            scope.$parent.superboxToggled = scope.$id;
            var others = element.parent().find(".superbox-list");
            others.removeClass("active");
            others.next().css('display','none');
            element.addClass("active");
            element.next().css('display','block');
          }
          
          // var $this = element;
          // console.log($this);
          // var superbox      = $('<div class="superbox-show"></div>');

          // $('.superbox-list').removeClass('active');
          // $this.addClass('active');
          
          // if ($(this).next().hasClass('superbox-show')) {
          //   $('.superbox-list').removeClass('active');
          //   superbox.toggle();
          // } else {
          //   superbox.insertAfter(this).css('display', 'block');
          //   $this.addClass('active');
          // }
          
          // $('html, body').animate({
          //   scrollTop:superbox.position().top - currentimg.width()
          // }, 'medium');
        });
      }
    };
  });