'use strict';

angular.module('doresolApp')
  .controller('TimelineCtrl', function ($scope, $rootScope,Util,Auth,$modal, MyMemorial,Memorial,$stateParams,User) {

    $scope.memorialKey = $stateParams.id;
    $scope.memorial = MyMemorial.getCurrentMemorial();
    // $scope.selectedEraKey = {};
    $scope.selectedEra = {};
    $scope.currentUser = User.getCurrentUser();
    
    // $scope.memorial = Memorial.myMemorials[$stateParams.id];
    // console.log($scope.memorial);

    // if($scope.memorial['timeline']) {
    //   $scope.timeline = $scope.memorial['timeline'];
    // };
    $scope.selectedEraHeadlineChange = function(){
      var isDuplicated = false;

      if($scope.memorial.timeline) {
        angular.forEach($scope.memorial.timeline.era, function(era, key) {
          if(key!=$scope.selectedEraKey && era.headline == $scope.selectedEra.headline) {
            isDuplicated = true;
          }
        });
      }

      if(isDuplicated){
        $scope.eraForm.name.$setValidity("duplicated",false);
      }else{
        $scope.eraForm.name.$setValidity("duplicated",true);
      }
    };

    $scope.getSelectedEraKey = function(){
      return $scope.selectedEraKey;
    };

    $scope.setSelectedEra = function(key, era){
      $scope.selectedEraKey = key;
      angular.copy(era, $scope.selectedEra);
      $scope.stories = [];
    };

    $scope.removeSelectedEra = function(key){
      $scope.selectedEraKey = null;
      $scope.selectedEra = {};
      Memorial.removeEra($scope.memorialKey,key);
    };

    $scope.submitEra = function(form) {
      if(form.$valid) {

        $scope.selectedEra.startDate = moment($scope.selectedEra.startDate).format('YYYY-MM-DD');
        $scope.selectedEra.endDate = moment($scope.selectedEra.endDate).format('YYYY-MM-DD');

        if($scope.selectedEraKey == 'tempKey') {
          Memorial.createEra($scope.memorialKey, $scope.selectedEra);
          $scope.selectedEra = {}
          $scope.selectedEraKey = null;
          $scope.eraForm.$setPristine();
        } else {
          Memorial.updateEra($scope.memorialKey, $scope.selectedEraKey, $scope.selectedEra);
        }
      }

      // var memorial = $scope.$parent.memorial;

      // if(form.$valid){
      //   var memorial = $resource('/api/memorials/:meorialId', {meorialId:'@id'});
      //   var user = User.get({meorialId:memorialId}, function() {
      //     user.abc = true;
      //     user.$save();
      //   });

      //   var Memorial = $resource('/api/memorials');

      //   var newMemorial = new Memorial({
      //       admin_id: currentUser,
      //       name: $scope.newMemorial.name,
      //       date_of_birth: $scope.newMemorial.dateOfBirth,
      //       date_of_death: $scope.newMemorial.dateOfDeath,
      //       file: $scope.newMemorial.lastUploadingFile
      //   });

      //   // console.log(newMemorial);
      //   newMemorial.$save(function(item, putResponseHeaders) {
      //     //item => saved user object
      //     //putResponseHeaders => $http header getter
      //     $state.transitionTo('memorial.timeline', {id: item._id});
      //   }, function(error){
      //     // console.log(error);
      //     // console.log('error');
      //   });
      // }

    };

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    };

    $scope.createTimeline = function(){
      var memorial = $scope.$parent.memorial;

      console.log($scope);
      var timeline_data = {
        "timeline": {
           "headline": memorial.name,
           "type":"default",
           "startDate":memorial.date_of_birth,
           // "text":"<i><span class='c1'></span> & <span class='c2'></span></i>",
           "asset": {
                        "media":memorial.file.url,
                        // "caption":"아버지 .. 아포 중학교 앞에서"
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

      var timeline_dates = [];
      for(var i=0;i<$scope.stories.length;i++){
        timeline_dates.push({
          "startDate":$scope.stories[i].start_date.replace(/\-/g,','),
          "headline":$scope.stories[i].name,
          "text":$scope.stories[i].desc,
          "asset":{
            "media": '/tmp/' + $scope.stories[i].file.uniqueIdentifier,
            "thumbnail": '/tmp/' + $scope.stories[i].file.uniqueIdentifier
          }
        });
      }

      timeline_data.timeline.date = timeline_dates;

      createStoryJS({
           type:       'timeline',
           width:      '100%',
           height:     '800',
           source:     timeline_data,
           embed_id:   'timeline-embed'
       });

      $scope.temp_created = true;
    };

    $scope.flowFilesAdded = function($files){
      // console.log($files);
      angular.forEach($files, function(value, key) {
        value.type = value.file.type.split("/")[0];
        
        $scope.stories.push(
          {
            name:'제목없음',
            new_story: true,
            file: value,
            start_date: moment(value.file.lastModifiedDate).format("YYYY-MM-DD")
            // Mon Sep 10 2012 15:19:56 GMT+0900 (KST)
          }
        );
      });
    };

    $scope.flowFileDeleted = function(story){
      var index = $scope.stories.indexOf(story);

      // TODO: delete from remote server
      story.file.cancel();

      $scope.stories.splice(index, 1);  
    };
    
    $scope.openModal = function (story) {
      var modalInstance = $modal.open({
        templateUrl: 'app/memorial/story/edit_modal.html',
        controller: 'ModalCtrl',
        size: 'lg',
        resolve: { 
          paramFromDialogName: function(){
            return 'story';
          },         
          paramFromDialogObject: function () {
            console.log(story);
            return story;
          }
        }
      });

      modalInstance.result.then(function (paramFromDialogObject) {
        //click ok
        // console.log('click ok');
        // $scope.paramFromDialogObject = paramFromDialogObject;
        console.log($scope);
      }, function () {
        //canceled
      });
    };
  });


// {
//     "timeline":
//     {
//         "headline":"The Main Timeline Headline Goes here",
//         "type":"default",
//         "text":"<p>Intro body text goes here, some HTML is ok</p>",
//         "asset": {
//             "media":"http://yourdomain_or_socialmedialink_goes_here.jpg",
//             "credit":"Credit Name Goes Here",
//             "caption":"Caption text goes here"
//         },
//         "date": [
//             {
//                 "startDate":"2011,12,10",
//                 "endDate":"2011,12,11",
//                 "headline":"Headline Goes Here",
//                 "text":"<p>Body text goes here, some HTML is OK</p>",
//                 "tag":"This is Optional",
//                 "classname":"optionaluniqueclassnamecanbeaddedhere",
//                 "asset": {
//                     "media":"http://twitter.com/ArjunaSoriano/status/164181156147900416",
//                     "thumbnail":"optional-32x32px.jpg",
//                     "credit":"Credit Name Goes Here",
//                     "caption":"Caption text goes here"
//                 }
//             }
//         ],
//         "era": [
//             {
//                 "startDate":"2011,12,10",
//                 "endDate":"2011,12,11",
//                 "headline":"Headline Goes Here",
//                 "text":"<p>Body text goes here, some HTML is OK</p>",
//                 "tag":"This is Optional"
//             }

//         ]
//     }
// }
