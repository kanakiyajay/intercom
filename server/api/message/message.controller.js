'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Message = require('./message.model');
var Customer = require('../customer/customer.model');
var Employee = require('../employee/employee.model');
var Conversation = require('../conversation/conversation.model');
var defaults = {
  skip: 0,
  limit: 10,
  cookieId: '__PIXEL_USER'
};

// Get list of messages sorted in reverse chronology
exports.index = function(req, res) {

  // TODO: Set Hard Limits over here for minima and maxima
  // if (!req.query.conversation_id) { return; }
  var limit = parseInt(req.query.limit) || defaults.limit;
  var skip = parseInt(req.query.skip) || defaults.skip;

  Message
    .find({
      conversation_id: mongoose.Types.ObjectId(req.query.conversation_id)
    })
    .skip(skip)
    .limit(limit)
    .populate('created_by', '-hashedPassword -salt')
    .sort('createdAt')
    .exec(function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.json(200, messages);
    });
};

// Creates a new message in the DB.
exports.create = function(req, res) {
  var user = req.user;

  if (!req.body.conversation_id) {
    console.log('New Conversation');
    // TODO: Insert client id over here
    Conversation.create({
      client_id: req.user.client_id,
      poc_kind: 'Employee',
      poc_id: req.user._id,
      customer_id: req.body.customer_id
    }, function(err, conv) {
      handleMessage(conv._id, req, res);
    });
  } else {
    var convId = req.body.conversation_id;
    handleMessage(convId, req, res);
  }
};

function handleMessage(convId, req, res) {
  var message = {
    conversation_id: convId,
    message: req.body.message,
    attachments: [],
    type: 'e2c',
    created_by_model: 'Employee',
    created_by: req.user._id
  };

  Message.create(message, function(err, message) {
    if(err) { return handleError(res, err); }
    return res.json(201, message);
  });
}

function pushConvToCustomer(convId, cust, cb) {
  if (cust.conversations.indexOf(convId) === -1) {
    cust.conversations.push(convId);
    cust.save(cb);
  } else {
    cb(null, cust);
  }
}

// Updates an existing message in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Message.findById(req.params.id, function (err, message) {
    if (err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    var updated = _.merge(message, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, message);
    });
  });
};

// Deletes a message from the DB.
exports.destroy = function(req, res) {
  Message.findById(req.params.id, function (err, message) {
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    message.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.error(err);
  return res.send(500, err);
}