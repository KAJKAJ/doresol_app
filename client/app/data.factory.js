'use strict';

angular.module('doresolApp')
  .factory('Memorial', function Memorial($resource) {
  	return $resource('/api/memorials/:id',{id:'@id'},{
  		}
  	);
  });

