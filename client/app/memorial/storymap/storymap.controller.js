'use strict';

angular.module('doresolApp')
  .controller('StorymapCtrl', function ($scope,$state,$stateParams,Memorial,ENV,$firebase,User,Composite,Comment,Util) {

  // storymap_data can be an URL or a Javascript object
  var storymap_data = 'http://localhost:9876/app/memorial/storymap/storymap.json'; 
  // var storymap_data = 'http://storymap.knightlab.com/static/demo/demo.json'; 

  // certain settings must be passed within a separate options object
  var storymap_options = {};

  var storymap = new VCO.StoryMap('mapdiv', storymap_data, storymap_options);
  window.onresize = function(event) {
      storymap.updateDisplay(); // this isn't automatic
  }          

  });
