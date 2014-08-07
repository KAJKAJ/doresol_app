'use strict';

 angular.module('doresolApp')
  .factory('MyMemorial', function Memorial() {

  var myMemorials = {};

  var addMyMemorial = function(key,value){
  	myMemorials[key] = value;
  };

  var removeMyMemorial = function(key){
  	delete myMemorials[key];
  };

  var getMyMemorials = function(){
  	return myMemorials;
  };

	return {
		addMyMemorial:addMyMemorial,
		removeMyMemorial:removeMyMemorial,
		getMyMemorials:getMyMemorials
	};
	
});
