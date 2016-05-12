'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/', auth.isAuthenticated(), controller.update);

// TODO: Seperate this in a different folder
var customerCtrl = require('./message.customer.controller.js');
var customerRouter = express.Router();

customerRouter.get('/', auth.attachClient, customerCtrl.index);
customerRouter.post('/', auth.attachClient, customerCtrl.create);
customerRouter.put('/', auth.attachClient, customerCtrl.update);

router.use('/customers', customerRouter);

module.exports = router;
