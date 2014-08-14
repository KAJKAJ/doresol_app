'use strict';

angular.module('doresolApp')
  .controller('TimelineCtrl', function ($scope, $rootScope,Util,Auth,$modal, MyMemorial,Memorial,$stateParams,User,Story,$state, ENV, $firebase,$timeout) {

    $scope.memorialKey = $stateParams.id;
    $scope.memorial = MyMemorial.getCurrentMemorial();

    $scope.memorial.$loaded().then(function(value){
      console.log(value);
      $timeout(function(){$scope.createTimeline()},1000);
      if(!value.timeline || !value.timeline.stories){
        $scope.editMode = true;
      }
    });

    // $scope.selectedEraKey = {};
    $scope.selectedEra = {};
    $scope.currentUser = User.getCurrentUser();

    $scope.storiesArray = {};
    $scope.storiesObject = {};

    $scope.sortableOptions = {
      // containment: "parent",
      cursor: "move",
      tolerance: "pointer",

      start: function(e, ui) {
        $(e.target).data("ui-sortable").floating = true;
      },
      
      // After sorting is completed
      stop: function(e, ui) {
        // for (var i=0; i< $scope.storiesArray[$scope.selectedEraKey].length; i++) {
          
        // };
      }
    };

    var storiesRef = new Firebase(ENV.FIREBASE_URI + '/stories');
    var currentTimelineStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/timeline/stories');
    var _timelineStories = $firebase(currentTimelineStoriesRef).$asArray();

    _timelineStories.$watch(function(event){
      switch(event.event){
        case "child_removed":
          // removeMyMemorial(event.key);
          break;
        case "child_added":
          var childRef = storiesRef.child(event.key);
          var child = $firebase(childRef).$asObject();
          child.$loaded().then(function(value){
            // $scope.timelineStories[event.key] = value;
            if($scope.storiesArray[value.ref_era] == undefined) {
              $scope.storiesArray[value.ref_era] = [];
              $scope.storiesObject[value.ref_era] = {};
            };
            $scope.storiesArray[value.ref_era].push(event.key);
            $scope.storiesObject[value.ref_era][event.key] = value;

            $scope.storiesArray[value.ref_era].sort(function(aKey,bKey){
              var aValue = $scope.storiesObject[value.ref_era][aKey];
              var bValue = $scope.storiesObject[value.ref_era][bKey];
              var aStartDate = moment(aValue.startDate).unix();
              var bStartDate = moment(bValue.startDate).unix();
              return aStartDate > bStartDate ? 1 : -1;
            });
            
            // $scope.stories[value.ref_era][event.key] = true;

            value.$bindTo($scope, "storiesObject['"+value.ref_era+"']['"+event.key+"']").then(function(){
              console.log($scope.storiesObject[value.ref_era][event.key]);
            });            
          });
        break;
      }
    });
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
        $scope.eraForm.headline.$setValidity("duplicated",false);
      }else{
        $scope.eraForm.headline.$setValidity("duplicated",true);
      }
    };

    $scope.getSelectedEraKey = function(){
      return $scope.selectedEraKey;
    };

    $scope.setSelectedEra = function(key, era){
      $scope.selectedEraKey = key;
      angular.copy(era, $scope.selectedEra);
      // $scope.stories = [];
      if(key == 'tempKey'){
        $scope.eraForm.$setPristine();
      }else{
        /*
        $scope.stories[$scope.selectedEraKey] = [];
        
        angular.forEach($scope.timelineStories,function(value,key){
          if(value.ref_era == $scope.selectedEraKey){
            $scope.stories[$scope.selectedEraKey].push(value);
          }
        });
        */
      }
    };

    $scope.removeSelectedEra = function(key){
      $scope.selectedEraKey = null;
      $scope.selectedEra = {};

      Memorial.removeEra($scope.memorialKey,key);
      // todo : should delete stories referenced
      //
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
    };

    $scope.openDatepicker = function($event,variable) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope[variable] = true;

    };

    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    };
    
    $scope.removeSelectedStory = function(storyId) {
      // delete $scope.storiesObject[$scope.selectedEraKey][storyId];
      var index = $scope.storiesArray[$scope.selectedEraKey].indexOf(storyId);
      $scope.storiesArray[$scope.selectedEraKey].splice(index, 1);  

      if(!$scope.storiesObject[$scope.selectedEraKey][storyId].newStory){
        MyMemorial.removeStoryFromTimeline($scope.memorialKey,storyId);
      }
    };

    $scope.createTimeline = function(){
      var timeline_data = {
        "timeline": {
           "headline": $scope.memorial.name,
           "type":"default",
           "startDate": $scope.memorial.dateOfBirth,
           // "text":"<i><span class='c1'></span> & <span class='c2'></span></i>",
           "asset": {
                        "media": $scope.memorial.file.url,
                        // "caption":"아버지 .. 아포 중학교 앞에서"
                    }            
        }
      };

      var timeline_dates = [];
      angular.forEach($scope.storiesObject,function(stories,key){
        angular.forEach(stories,function(story,key){
          timeline_dates.push(story);
        });
      });

      var timeline_eras = [];
      angular.forEach($scope.memorial.timeline.era,function(era,key){
        timeline_eras.push(era);
      });

      timeline_data.timeline.date = timeline_dates;
      timeline_data.timeline.era = timeline_eras;

      createStoryJS({
           type:       'timeline',
           width:      '100%',
           height:     '800',
           source:     JSON.stringify(timeline_data),
           embed_id:   'timeline-embed'
       });      
    };

   $scope.uploadTimelineStory = function(){
      angular.forEach($scope.storiesArray, function(storiesKey, eraKey) {
        var eraStart = moment($scope.memorial.timeline.era[eraKey].startDate);
        var eraEnd = moment($scope.memorial.timeline.era[eraKey].endDate);
        var cntStories = storiesKey.length;
        var timeStep = (eraEnd - eraStart)/cntStories;
        var index = 0;

        angular.forEach(storiesKey, function(storyKey, key) {
          $scope.storiesObject[eraKey][storyKey].startDate = moment(eraStart + timeStep*index).format("YYYY-MM-DD");
          index++;

          if($scope.storiesObject[eraKey][storyKey].newStory){
            // create story
            var copyStory = {};
            angular.copy($scope.storiesObject[eraKey][storyKey],copyStory);

            var file = {
              type: copyStory.file.type,
              location: 'local',
              url: '/tmp/' + copyStory.file.uniqueIdentifier,
              updated_at: moment().toString()
            }
            copyStory.file = file;
            
            delete copyStory.newStory;

            MyMemorial.createStory($scope.memorialKey,copyStory).then(function(value){
              delete $scope.storiesObject[eraKey][storyKey];
              var index = $scope.storiesArray[eraKey].indexOf(storyKey);
              $scope.storiesArray[eraKey].splice(index, 1);  
            }, function(error){
              console.log(error);

            });

          }
        });
      });
      
      $scope.toggleEditMode();
      $scope.createTimeline();
    };
    
    $scope.flowFilesAdded = function($files){
      console.log($files);
      angular.forEach($files, function(value, key) {
        value.type = value.file.type.split("/")[0];
      
        var startDate = moment(value.file.lastModifieldDate).format("YYYY-MM-DD");
        console.log(key);

        if($scope.storiesArray[$scope.selectedEraKey] == undefined) {
          $scope.storiesArray[$scope.selectedEraKey] = [];
          $scope.storiesObject[$scope.selectedEraKey] = {};
        };

        $scope.storiesArray[$scope.selectedEraKey].push(value.uniqueIdentifier);
        $scope.storiesObject[$scope.selectedEraKey][value.uniqueIdentifier] = 
          {
            file: value,
            newStory: true,

            ref_memorial: $scope.memorialKey,
            ref_era: $scope.selectedEraKey,

            startDate: startDate,
            text: null,
            headline: '제목없음',
            asset: {
              "media": '/tmp/' + value.uniqueIdentifier,
              "thumbnail:": '/tmp/' + value.uniqueIdentifier,
            }
          };
      });
    };

    // $scope.flowFileDeleted = function(story){
    //   var index = $scope.stories.indexOf(story);

    //   // TODO: delete from remote server
    //   story.file.cancel();

    //   $scope.stories.splice(index, 1);  
    // };

    $scope.toggleEditMode = function(){
      $scope.editMode = !$scope.editMode;
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
