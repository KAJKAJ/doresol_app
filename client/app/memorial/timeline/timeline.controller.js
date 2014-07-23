'use strict';

angular.module('doresolApp')
  .controller('TimelineCtrl', function ($scope,Util,Auth) {
    var current_user = Auth.getCurrentUser()._id;

  	$scope.dataObject = {
          "timeline": {
              "headline":"김학구",
              "type":"default",
      				"startDate":"1938,1",
      				"text":"<i><span class='c1'></span> & <span class='c2'></span></i>",
      				"asset": {
                          "media":"/assets/images/father/1.png",
                          "caption":"아버지 .. 아포 중학교 앞에서"
                      },
              "date": [{
                      "startDate":"1938,12,21",
                      "endDate":"1938,12,25",
                      "headline":"결혼식 with 서경분",
                      "text":"장소는 어디어디에서 결혼하게 되었음. 그리고 이렇게 되고 어쩌구 저쩌구 했었던 걸로 기억한다. 누구와 같이 갔는지는 정확히 잘 모르겠다. 어쩌구 저쩌구.. ",
                      "asset":
                      {
                          "media":"/assets/images/father/1.png",
                          "thumbnail":"/assets/images/father/1.png",
                      }
                  },
              ]
          }
      };

      $scope.getFlowFileUniqueId = function(file){
        return current_user + '-' + Util.getFlowFileUniqueId(file,current_user);
      };

      $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
        console.log(flowFile.uniqueIdentifier); 
      });

    	// createStoryJS({
     //      type:       'timeline',
     //      width:      '100%',
     //      height:     '800',
     //      source:     $scope.dataObject,
     //      embed_id:   'timeline-embed'
     //  });
  });
