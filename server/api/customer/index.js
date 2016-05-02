'use strict';

var express = require('express');
var cors = require('cors');
var controller = require('./customer.controller');

var router = express.Router();

// Enable CORS over here
router.post('/', cors(), controller.create);

router.put('/:id', controller.update);

module.exports = router;