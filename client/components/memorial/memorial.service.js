'use strict';

 angular.module('doresolApp')
  .factory('Memorial', function Memorial($firebase, $q, ENV) {
  
  var myMemorials = {};
  var currentMemorial = null;

  var setCurrentMemorial = function(memorialId){
    currentMemorial = findById(memorialId);
  }

  var getCurrentMemorial = function(){
    return currentMemorial;
  }

  var addMyMemorial = function(key,value){
  	myMemorials[key] = value;
  }

  var removeMyMemorial = function(key){
  	delete myMemorials[key];
  }

  var getMyMemorials = function(){
  	return myMemorials;
  }

  var getMyMemorial = function(memorialId) {
    return myMemorials[memorialId];
  }
  	
  var clearMyMemorial = function(){
  	myMemorials = {};
  }

	var ref = new Firebase(ENV.FIREBASE_URI + '/memorials');
	var memorials = $firebase(ref).$asArray();

	var create = function(memorial) {
		return memorials.$add(memorial).then( function(ref) {
    	return {
				key: ref.name(),
				fileParentPath: memorial.file?ref.toString():null,
				fileUrl:  memorial.file?memorial.file.url:null
			}
		});  	
  }

	var findById = function(memorialId){
		var memorial = ref.child(memorialId);
		return $firebase(memorial).$asObject();
	}

	var remove = function(memorialId) {
		// var memorial = Memorial.find(memorialId);

		// memorial.$on('loaded', function() {
		// 	var user = User.$getCurrentUser();

		// 	memorials.$remove(memorialId).then( function() {
		// 		user.$child('memorials').$child('owns').$remove(memorialId);
		// 	});

		// });
	}

	var createEra = function(memorialId, eraItem) {
		var eraRef = ref.child(memorialId + '/timeline/era');
		var era = $firebase(eraRef);
		return era.$push(eraItem);
	}

	var updateEra = function(memorialId, eraId, eraItem){
		var eraRef = ref.child(memorialId + '/timeline/era');
		var era = $firebase(eraRef);
		return era.$set(eraId,eraItem);
	}

	var removeEra = function(memorialId, eraId){
		var eraRef = ref.child(memorialId + '/timeline/era');
		var era = $firebase(eraRef);
		return  era.$remove(eraId);
	}

	return {
		remove: remove,
		create: create,
		findById: findById,

		addMyMemorial:addMyMemorial,
		removeMyMemorial:removeMyMemorial,
		getMyMemorials:getMyMemorials,
    getMyMemorial:getMyMemorial,
    clearMyMemorial:clearMyMemorial,
    setCurrentMemorial:setCurrentMemorial,
    getCurrentMemorial:getCurrentMemorial,

		createEra:createEra,
		updateEra:updateEra,
		removeEra:removeEra

	};
	
});
