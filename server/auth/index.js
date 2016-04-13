'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config/environment');
var Emp = require('../api/employee/employee.model');

// Passport Configuration
require('./local/passport').setup(Emp, config);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;