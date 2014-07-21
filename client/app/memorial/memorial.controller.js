'use strict';

angular.module('doresolApp')
  .controller('MemorialCtrl', function ($scope,$state,Util,Auth,$resource) {
    if($state.is("memorial")){
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
        	       {
                        "startDate":"2006,12,21",
                        "headline":"결혼식 with 서경분",
                        "text":"장소는 어디어디에서 결혼하게 되었음",
                        "asset":
                        {
                            "media":"https://vimeo.com/78886089",
                            "thumbnail":"https://vimeo.com/78886089",
                            "credit":"",
                            "caption":""
                        }
                    }

                ]
            }
        };

      	createStoryJS({
            type:       'timeline',
            width:      '100%',
            height:     '800',
            source:     $scope.dataObject,
            embed_id:   'timeline-embed'
        });
      } else if($state.is("memorial_create")){
        $scope.today = Date.now();
        $scope.new_memorial = {};
        var current_user = Auth.getCurrentUser()._id;

        $scope.create_memorial = function(form){
          if(form.$valid){
            var Memorial = $resource('/api/memorials');

            var new_memorial = new Memorial({
                admin_id: current_user,
                name: $scope.new_memorial.name,
                date_of_birth: $scope.new_memorial.date_of_birth,
                date_of_death: $scope.new_memorial.date_of_death,
                file: $scope.new_memorial.last_uploading_file
            });

            // console.log(new_memorial);
            new_memorial.$save();
            // console.log($scope.new_memorial);
          }
        };

        $scope.getUniqueId = function(file){
          var relativePath = file.relativePath || file.webkitRelativePath || file.fileName || file.name;
          return current_user + '-' + Util.getUniqueId() + '-' + relativePath.replace(/[^\.0-9a-zA-Z_-]/img, '');
        };

        $scope.$on('flow::fileSuccess', function (event, $flow, flowFile, message) {
          $scope.fileUploading = false;
          $scope.new_memorial.last_uploading_file = flowFile.uniqueIdentifier;
        });

        $scope.open_datepicker = function($event,variable) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope[variable] = true;

        };

      }

  });
