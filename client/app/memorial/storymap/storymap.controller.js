'use strict';

angular.module('doresolApp')
  .controller('StorymapCtrl', function ($scope,$state,$stateParams,Memorial,ENV,$firebase,User,Composite,Comment,Util,Story,$timeout) {

    $scope.mode = 'setting';

    $scope.currentUser = User.getCurrentUser();
    $scope.isChanged = false;

    $scope.memorialKey = $stateParams.id;
    $scope.memorial = Memorial.getCurrentMemorial();

    // for setting
    $scope.storiesArray = [];
    $scope.storiesObject = {};

    // for timeline
    $scope.timelineStoriesArray = [];
    $scope.timelineStoriesObject = [];

    // for storymap
    $scope.storymapStoriesArray = [];
    $scope.storymapStoriesObject = [];

    $scope.isMemorialLoaded = false;

    $scope.memorial.$loaded().then(function(value){

      console.log(value.stories);

      $scope.isOwner = Memorial.isOwner();
      $scope.isMember = Memorial.isMember();
      $scope.isGuest = Memorial.isGuest();

      angular.forEach(value.stories, function(story, key) {

        $scope.storiesArray.push(key);
        $scope.storiesObject[key] = story;

        $scope.timelineStoriesArray.push(key);
        $scope.timelineStoriesObject[key] = story;

        if(story.location) {
          $scope.storymapStoriesArray.push(key);
          $scope.storymapStoriesObject[key] = story;
        }
      });

      switch($scope.mode) {
        case 'timeline':
          $scope.createTimeline();
          break;
        case 'storymap':
          $scope.createStorymap();
          break;
        default:
          break;
      };

    });


    $scope.sortableOptions = {
      // containment: "parent",
      cursor: "move",
      tolerance: "pointer", 

      start: function(e, ui) {
        // $(e.target).data("ui-sortable").floating = true;
      },
      
      // After sorting is completed
      stop: function(e, ui) {
        // for (var i=0; i< $scope.storiesArray[$scope.selectedEraKey].length; i++) {
          
        // };
        $scope.isChanged = true;
      }
    };

    $scope.changeMode = function(mode){
    $scope.mode = mode;
     switch(mode) {
        case 'setting':
          break;
        case 'timeline':
          $scope.createTimeline();
          break;
        case 'storymap':
          $scope.createStorymap();
          break;
        default:
          break;
      };
    }

    var currentStoriesRef =  new Firebase(ENV.FIREBASE_URI + '/memorials/'+$scope.memorialKey+'/stories');
    var _stories = $firebase(currentStoriesRef).$asArray();

    _stories.$watch(function(event){
        switch(event.event){
          case "child_removed":
            if($scope.isMemorialLoaded == false) break;
            // removeMyMemorial(event.key);
            break;
          case "child_added":

            if($scope.isMemorialLoaded == false) break;

            var childRef = currentStoriesRef.child(event.key);
            var child = $firebase(childRef).$asObject();
            
            child.$loaded().then(function(value){
              // console.log(value);
              $scope.storiesArray.push(event.key);
              $scope.storiesObject[event.key] = value;  
              
              // new object case delete it
              if(value.newStory) {
                delete $scope.storiesObject[value.tempKey];
                var index = $scope.storiesArray.indexOf(value.tempKey);
                $scope.storiesArray.splice(index, 1);
              }

              $scope.storiesArray.sort(function(aKey,bKey){
                var aValue = $scope.storiesObject[aKey];
                var bValue = $scope.storiesObject[bKey];
                var aStartDate = moment(aValue.startDate).unix();
                var bStartDate = moment(bValue.startDate).unix();
                return aStartDate > bStartDate ? 1 : -1;
              });

              if(value.location){
                $scope.storymapStoriesArray.push(event.key);
                $scope.storymapStoriesObject[event.key] = value;  

                $scope.storymapStoriesArray.sort(function(aKey,bKey){
                  var aValue = $scope.storymapStoriesObject[aKey];
                  var bValue = $scope.storymapStoriesObject[bKey];
                  var aStartDate = moment(aValue.startDate).unix();
                  var bStartDate = moment(bValue.startDate).unix();
                  return aStartDate > bStartDate ? 1 : -1;
                });

              }else{
                $scope.timelineStoriesArray.push(event.key);
                $scope.timelineStoriesObject[event.key] = value;

                $scope.timelineStoriesArray.sort(function(aKey,bKey){
                  var aValue = $scope.timelineStoriesObject[aKey];
                  var bValue = $scope.timelineStoriesObject[bKey];
                  var aStartDate = moment(aValue.startDate).unix();
                  var bStartDate = moment(bValue.startDate).unix();
                  return aStartDate > bStartDate ? 1 : -1;
                });
              }
            });

          break;
        }
    });

    
    $scope.getFlowFileUniqueId = function(file){
      return $scope.currentUser.uid.replace(/[^\.0-9a-zA-Z_-]/img, '') + '-' + Util.getFlowFileUniqueId(file,$scope.currentUser);
    };
    
    $scope.removeSelectedStory = function(storyId) {
      // delete $scope.storiesObject[$scope.selectedEraKey][storyId];
      var index = $scope.storiesArray.indexOf(storyId);
      $scope.storiesArray.splice(index, 1);  

      if(!$scope.storiesObject[storyId].newStory){
        // TODO: 바껴야 됨
        Story.removeStory($scope.storiesObject[storyId]);
      }
    };

    $scope.createTimeline = function(){
      var timeline_data = {
        "timeline": {
           "headline": $scope.memorial.name,
           "type":"default",
           // "text": $scope.memorial.name + "님의 Timeline",
           "text": "님의 타임라인입니다..",
           "startDate": $scope.memorial.dateOfBirth,
           "asset": {
                        "media": $scope.memorial.file.url
                    }            
        }
      };

      var timeline_dates = [];
      angular.forEach($scope.timelineStoriesArray,function(storyKey,index){
        var copyStory = {
          file:$scope.timelineStoriesObject[storyKey].file,
          newStory: false,
          ref_memorial:$scope.timelineStoriesObject[storyKey].ref_memorial,
          ref_user:$scope.timelineStoriesObject[storyKey].ref_user,
          startDate:$scope.timelineStoriesObject[storyKey].startDate,
          text:$scope.timelineStoriesObject[storyKey].text.text,
          headline:$scope.timelineStoriesObject[storyKey].text.headline,
          asset:{
            media:$scope.timelineStoriesObject[storyKey].media.url,
            thumbnail:$scope.timelineStoriesObject[storyKey].media.url
          }
        }
        timeline_dates.push(copyStory);
      });
      
      timeline_data.timeline.date = timeline_dates;
      console.log(timeline_data);
      angular.element('#timeline-embed').empty();

      createStoryJS({
           type:       'timeline',
           // width:      '100%',
           height:     '700',
           source:     timeline_data,
           embed_id:   'timeline-embed'
       });
    };

    $scope.createStorymap = function(){
      // certain settings must be passed within a separate options object
      var storymap_options = {
        // width: 500,                // required for embed tool; width of StoryMap                    
        // height: 800,               // required for embed tool; width of StoryMap
        storymap: {
            language: "KR",          // required; two-letter ISO language code
            map_type: "stamen:toner-lines",          // required
            map_as_image: false,       // required
        }
      }
      
      var storymap_data = {
        storymap:{
          slides:[]
        }
      };

      storymap_data.storymap.slides.push(
        {
            type: "overview",
            text: {
               headline: $scope.memorial.name + "<small>Story Map..</small>",
               text: ""
            },
            media: {
              url:              $scope.memorial.file.url,
              caption:          "Overview"
            }
        }
      );
      angular.forEach($scope.storymapStoriesArray,function(storyKey){
        var copyStory = {
          $id: $scope.storymapStoriesObject[storyKey].$id,
          text:$scope.storymapStoriesObject[storyKey].text,
          created_at:$scope.storymapStoriesObject[storyKey].created_at,
          file:$scope.storymapStoriesObject[storyKey].file,
          location:$scope.storymapStoriesObject[storyKey].location,
          media:$scope.storymapStoriesObject[storyKey].media,
          newStory:$scope.storymapStoriesObject[storyKey].newStory,
          ref_memorial:$scope.storymapStoriesObject[storyKey].ref_memorial,
          ref_user:$scope.storymapStoriesObject[storyKey].ref_user,
          startDate:$scope.storymapStoriesObject[storyKey].startDate,
          updated_at:$scope.storymapStoriesObject[storyKey].updated_at
        };
        
        storymap_data.storymap.slides.push(copyStory);
      });

      angular.element('#mapdiv').empty();

      var storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);

      window.onresize = function(event) {
        storymap.updateDisplay(); // this isn't automatic
      } 
      
    };

   $scope.uploadStory = function(){
      if($scope.storiesArray.length > 0){
        var memorialStart = moment($scope.memorial.dateOfBirth);
        var memorialEnd = moment($scope.memorial.dateOfDeath);
        var cntStories = $scope.storiesArray.length;
        var timeStep = (memorialEnd - memorialStart)/cntStories;
        var index = 0;
        angular.forEach($scope.storiesArray, function(storyKey,index) {
          $scope.storiesObject[storyKey].startDate = moment(memorialStart + timeStep*index).format("YYYY-MM-DD");
          index++;
          if($scope.storiesObject[storyKey].newStory){
            // create story
            var copyStory = {};
            angular.copy($scope.storiesObject[storyKey],copyStory);

            var file = {
              type: copyStory.file.type,
              location: 'local',
              url: '/tmp/' + copyStory.file.uniqueIdentifier,
              updated_at: moment().toString()
            }
            copyStory.file = file;
            Composite.createStory($scope.memorialKey,copyStory).then(function(value){
              }, function(error){
                console.log(error);
            });
          }
          
        });
        $scope.isChanged = false;
        // waitStoryLoaded(true);
      }else{
        alert("재생 할 아이템이 없습니다.");
      }
    };
    
    $scope.flowFilesAdded = function($files){
      $scope.isChanged = true;
      angular.forEach($files, function(value, key) {
        value.type = value.file.type.split("/")[0];
      
        var tempKey = Util.getUniqueId();
        $scope.storiesArray.push(tempKey);
        $scope.storiesObject[tempKey] = 
          {
            file: value,
            newStory: true,
            tempKey: tempKey,

            ref_memorial: $scope.memorialKey,
            ref_user: $scope.currentUser.uid,
            
            text: {
              headline:'내용없음',
              text:'내용없음'
            },
            media:{
              url: '/tmp/' + value.uniqueIdentifier,
              credit: '',
              caption: ''
            },
            location:{
              
            }
          };
      });
    };
  });
