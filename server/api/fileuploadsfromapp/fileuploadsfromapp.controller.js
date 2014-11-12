'use strict';

var _ = require('lodash');
var fs = require('fs');

var  path = require('path');

exports.create = function(req, res) {
  console.log('upload from app');
  
  var file = req.files.file;
  var filePath = file.path;
  var lastIndex = filePath.lastIndexOf("/");
  var  tmpFileName = filePath.substr(lastIndex + 1);
  var image = req.body;
      
  image.fileName = tmpFileName;
  console.log(tmpFileName);

    // images.insert(image, function (err, result) {
    //     if (err) {
    //         console.log(err);
    //         return next(err);
    //     }
    //     res.json(image);
    // });
  res.json(image);
};


function handleError(res, err) {
  return res.send(500, err);
}