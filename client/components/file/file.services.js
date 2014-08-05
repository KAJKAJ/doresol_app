'use strict';

angular.module('doresolApp')
  .factory('File', function File($firebase, $q, ENV) {
    var fileService = $firebase(new Firebase(ENV.FIREBASE_URI + '/local_files'));

    var createLocalFile = function() {
    	
    };


    return {
    	createLocalFile: createLocalFile
    }

  });

