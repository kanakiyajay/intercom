'use strict';

var express = require('express');
var controller = require('./client.controller');
var cors = require('cors');

var router = express.Router();

// Enable CORS for the first call
router.get('/:id', cors(), controller.show);

module.exports = router;