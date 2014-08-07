'use strict';

angular.module('doresolApp')
	.constant('FIREBASE_URI', 'https://doresol-dev.firebaseio.com');

angular.module('doresolApp')
  .factory('DataService', ['$firebase', 'FIREBASE_URI', function ($firebase, FIREBASE_URI) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var rootRef_memorial = new Firebase(FIREBASE_URI + '/memorials');

	var items = $firebase(ref);

	var getItems = function() {
		return items;
	};

	var addItem = function(item) {
		// items.$add(item);
		items.$push(item);
	};

	var updateItem = function(id) {
		items.$save(id);
	};

	var removeItem = function(id) {
		items.$remove(id);
	};

	return {
		getItems: getItems,
		addItem: addItem,
		updateItem: updateItem,
		removeItem: removeItem
	};

  }]);
