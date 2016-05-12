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

// req.body.ids contains a list of ids of messages needed to be marked as read
exports.update = function(req, res) {
  var ids = req.body.ids;
  if (!ids || !ids.length) {
    return res.json(500, {

    });
  }

  Message.update({
    _id: {
      $in: ids
    }
  }, {
    $set: {
      status: 'read'
    }
  }, function (err, number) {
    console.log('Messages read', err, number);
    if (err) { return handleError(res, err); }
    return res.json(200, {
      status: 'done'
    });
  });
};

function handleError(res, err) {
  console.error(err);
  return res.send(500, err);
}