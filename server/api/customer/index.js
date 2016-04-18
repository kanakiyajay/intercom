'use strict';

var express = require('express');
var cors = require('cors');
var controller = require('./customer.controller');

var router = express.Router();

router.get('/', controller.get);
router.get('/:id', controller.show);

// Enable CORS over here
router.post('/', cors(), controller.create);

router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;