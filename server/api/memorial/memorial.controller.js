'use strict';

var _ = require('lodash');
var Memorial = require('./memorial.model');

// Get list of memorials
exports.index = function(req, res) {
  Memorial.find(function (err, memorials) {
    if(err) { return handleError(res, err); }
    return res.json(200, memorials);
  });
};

// Get a single memorial
exports.show = function(req, res) {
  Memorial.findById(req.params.id, function (err, memorial) {
    if(err) { return handleError(res, err); }
    if(!memorial) { return res.send(404); }
    return res.json(memorial);
  });
};

// Creates a new memorial in the DB.
exports.create = function(req, res) {
  Memorial.create(req.body, function(err, memorial) {
    if(err) { return handleError(res, err); }
    return res.json(201, memorial);
  });
};

// Updates an existing memorial in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Memorial.findById(req.params.id, function (err, memorial) {
    if (err) { return handleError(err); }
    if(!memorial) { return res.send(404); }
    var updated = _.merge(memorial, req.body);
    updated.save(function (err) {
      if (err) { return handleError(err); }
      return res.json(200, memorial);
    });
  });
};

// Deletes a memorial from the DB.
exports.destroy = function(req, res) {
  Memorial.findById(req.params.id, function (err, memorial) {
    if(err) { return handleError(res, err); }
    if(!memorial) { return res.send(404); }
    memorial.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}