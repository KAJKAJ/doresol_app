'use strict';

angular.module('doresolApp')
  .service('Util', function Util() {
    
    var getUniqueId = function(){
    	return Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    };

    var getFlowFileUniqueId = function(file){
      var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name;
      return this.getUniqueId() + '-' + relativePath.replace(/[^\.0-9a-zA-Z_-]/img, '');
    };

    var sequence = 0;

    var getSequence = function(){
    	sequence++;
    	return sequence;
    }

    return {
    	getUniqueId:getUniqueId,
    	getFlowFileUniqueId:getFlowFileUniqueId,
    	getSequence:getSequence
    }
  });
