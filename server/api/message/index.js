'use strict';

var express = require('express');
var controller = require('./message.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();


router.get('/', auth.isAuthenticated(), controller.index);
router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);

// TODO: Seperate this in a different folder
var customerCtrl = require('./message.customer.controller.js');
var customerRouter = express.Router();

customerRouter.get('/', customerCtrl.index);
customerRouter.post('/', customerCtrl.create);
customerRouter.put('/', customerCtrl.update);

router.use('/customers', customerRouter);

module.exports = router;
