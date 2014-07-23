'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$stateParams,$resource,$state) {
    $scope.$state = $state;
    
    var memorialId = $stateParams.id;
    var Memorial = $resource('/api/memorials/info/:id', {id:'@id'});
    
    $scope.memorial = Memorial.get({id:memorialId}, function() {
      // if(!$scope.memorial.timeline.created){
      //   var sample_data = {
      //     "timeline": {
      //     "headline":"김학구",
      //     "type":"default",
      //     "startDate":"1938,1",
      //     "text":"<i><span class='c1'></span> & <span class='c2'></span></i>",
      //     "asset": {
      //       "media":"/assets/images/father/1.png",
      //       "caption":"아버지 .. 아포 중학교 앞에서"
      //     },
      //     "date": [
      //       {
      //         "startDate":"1938,12,21",
      //         "endDate":"1938,12,25",
      //         "headline":"결혼식 with 서경분",
      //         "text":"장소는 어디어디에서 결혼하게 되었음. 그리고 이렇게 되고 어쩌구 저쩌구 했었던 걸로 기억한다. 누구와 같이 갔는지는 정확히 잘 모르겠다. 어쩌구 저쩌구.. ",
      //         "asset":
      //         {
      //           "media":"/assets/images/father/1.png",
      //           "thumbnail":"/assets/images/father/1.png",
      //         }
      //       },
      //       {
      //         "startDate":"1942,12,21",
      //         "headline":"결혼식 with 서경분",
      //         "text":"장소는 어디어디에서 결혼하게 되었음",
      //         "asset":
      //         {
      //           "media":"assets/images/father/3.png",
      //           "credit":"",
      //           "caption":""
      //         }
      //       },
      //       {
      //         "startDate":"1944,12,21",
      //         "headline":"결혼식 with 서경분",
      //         "text":"장소는 어디어디에서 결혼하게 되었음",
      //         "asset":
      //         {
      //           "media":"assets/images/father/4.png",
      //           "credit":"",
      //           "caption":""
      //         }
      //       },  
      //     ]
      //     }
      //   };

      //   createStoryJS({
      //       type:       'timeline',
      //       width:      '50%',
      //       height:     '400',
      //       source:     sample_data,
      //       embed_id:   'timeline-sample'
      //   });
      // }
    }, function(error){
      // console.log(error);
      // console.log('error');
    });

    	// $scope.dataObject = {
     //      "timeline": {
     //          "headline":"김학구",
     //          "type":"default",
     //  				"startDate":"1938,1",
     //  				"text":"<i><span class='c1'></span> & <span class='c2'></span></i>",
     //  				"asset": {
     //                      "media":"/assets/images/father/1.png",
     //                      "caption":"아버지 .. 아포 중학교 앞에서"
     //                  },
     //          "date": [{
     //                  "startDate":"1938,12,21",
     //                  "endDate":"1938,12,25",
     //                  "headline":"결혼식 with 서경분",
     //                  "text":"장소는 어디어디에서 결혼하게 되었음. 그리고 이렇게 되고 어쩌구 저쩌구 했었던 걸로 기억한다. 누구와 같이 갔는지는 정확히 잘 모르겠다. 어쩌구 저쩌구.. ",
     //                  "asset":
     //                  {
     //                      "media":"/assets/images/father/1.png",
     //                      "thumbnail":"/assets/images/father/1.png",
     //                  }
     //              },
     //  	       {
     //                  "startDate":"2006,12,21",
     //                  "headline":"결혼식 with 서경분",
     //                  "text":"장소는 어디어디에서 결혼하게 되었음",
     //                  "asset":
     //                  {
     //                      "media":"https://vimeo.com/78886089",
     //                      "thumbnail":"https://vimeo.com/78886089",
     //                      "credit":"",
     //                      "caption":""
     //                  }
     //              }

     //          ]
     //      }
     //  };

    	// createStoryJS({
     //      type:       'timeline',
     //      width:      '100%',
     //      height:     '800',
     //      source:     $scope.dataObject,
     //      embed_id:   'timeline-embed'
     //  });
      
  });
