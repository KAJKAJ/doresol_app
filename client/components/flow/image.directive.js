'use strict';

/**
 * Removes server error when user updates input
 */
angular.module('doresolApp')
  .directive('flowImage', function () {
    return {
      scope: false,
      require: '^flowInit',
      link: function(scope, element, attrs, ngModel) {
        var file = attrs.flowImage;
        scope.$watch(file, function (file) {
          if (!file) {
            return ;
          }
          var fileType = file.file.type.split('/');

          if(fileType[0] != 'image'){
            return ;
          }
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file.file);
          fileReader.onload = function (event) {
            scope.$apply(function () {
              attrs.$set('src', event.target.result);
            });
          };
        });
      }
    };
  });

