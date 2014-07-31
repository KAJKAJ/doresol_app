'use strict';

var express = require('express');
var controller = require('./memorial.controller');

var router = express.Router();

// created by me
router.get('/:user_id', controller.index);

// router.get('/', controller.index);
router.get('/info/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;

// // created by me
// router.get('/:user_id', controller.index);

// // router.get('/', controller.index);
// router.get('/info/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);