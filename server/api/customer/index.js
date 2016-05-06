'use strict';

var express = require('express');
var cors = require('cors');
var controller = require('./customer.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

// Enable CORS over here
router.post('/', cors(), auth.openMiddleware(), controller.create);
router.get('/', auth.isAuthenticated(), controller.get);

router.put('/:id', controller.update);

module.exports = router;