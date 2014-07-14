'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MemorialSchema = new Schema({
  admin_id: String,
  name: String,
  birth_date: Date,
  active: Boolean
});

module.exports = mongoose.model('Memorial', MemorialSchema);