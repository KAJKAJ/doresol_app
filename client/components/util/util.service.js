'use strict';

angular.module('doresolApp')
  .service('Util', function Util() {
    
    this.getUniqueId = function(){
    	return Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    };

    this.getFlowFileUniqueId = function(file){
      var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name;
      return this.getUniqueId() + '-' + relativePath.replace(/[^\.0-9a-zA-Z_-]/img, '');
    };
  });
