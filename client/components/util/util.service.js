'use strict';

angular.module('doresolApp')
  .service('Util', function Util($window) {
    
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

    var getBrowser = function(){
      var userAgent = $window.navigator.userAgent;
      var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i, msie: /msie/i};

      for(var key in browsers) {
        if (browsers[key].test(userAgent)) {
          return key;
        }
      };
     return 'unknown';
   }

   var getWidth = function(){
     return $window.innerWidth;
   }

   var isMobile = function(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }else {
      return false;
    }
   }

  return {
  	getUniqueId:getUniqueId,
  	getFlowFileUniqueId:getFlowFileUniqueId,
  	getSequence:getSequence,
    getBrowser:getBrowser,
    getWidth:getWidth,
    isMobile:isMobile
  }
});
