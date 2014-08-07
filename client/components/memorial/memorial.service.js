'use strict';

 angular.module('doresolApp')
  .factory('Memorial', function Memorial($firebase, $q, ENV, User, File) {

	var ref = new Firebase(ENV.FIREBASE_URI + '/memorials');
	var memorials = $firebase(ref).$asArray();

	var all = function() {
		return memorials;
	};

	var create = function(memorial) {
		var errorHandler = function(error){
	    return $q.reject(error);
	  };

		var _create_memorial = function(memorial) {
      return memorials.$add(memorial).then( function(ref) {
      	return {
					key: ref.name(),
					fileParentPath: memorial.file?ref.toString():null,
					fileUrl:  memorial.file?memorial.file.url:null
				}
			});
  	};

  	if(memorial.file){
  		return _create_memorial(memorial).then(File.createLocalFile).then(User.createMemorial, errorHandler);
  	}else{
  		return _create_memorial(memorial).then(User.createMemorial, errorHandler);
  	}
  	
  };

	var findById = function(memorialId){
		var memorial = ref.child(memorialId);
		return $firebase(memorial).$asObject();
	};

	var remove = function(memorialId) {
		// var memorial = Memorial.find(memorialId);

		// memorial.$on('loaded', function() {
		// 	var user = User.$getCurrentUser();

		// 	memorials.$remove(memorialId).then( function() {
		// 		user.$child('memorials').$child('owns').$remove(memorialId);
		// 	});

		// });
	};

	return {
		remove: remove,
		create: create,
		findById: findById
	};
	
});
