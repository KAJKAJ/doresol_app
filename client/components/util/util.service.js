'use strict';

angular.module('doresolApp')
  .service('Util', function Util() {
    
    this.getUniqueId = function(){
    	return Date.now() + '-' + Math.random().toString(36).substring(2, 15);
    };
  });
