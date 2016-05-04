'use strict';

var express = require('express');
var controller = require('./client.controller');

var router = express.Router();

router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);

module.exports = router;