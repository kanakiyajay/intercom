'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Message = require('./message.model');
var Customer = require('../customer/customer.model');
var Employee = require('../employee/employee.model');
var Conversation = require('../conversation/conversation.model');
var defaults = {
  skip: 0,
  limit: 10
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
    .populate('created_by')
    .sort('-createdAt')
    .exec(function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.json(200, messages);
    });
};

// Get a single message
exports.show = function(req, res) {
  Message.findById(req.params.id, function (err, message) {
    if(err) { return handleError(res, err); }
    if(!message) { return res.send(404); }
    return res.json(message);
  });
};

// Creates a new message in the DB.
// TODO: Create a new conversation if not one present
exports.create = function(req, res) {
  var user = req.user;
  /*
  if (!req.body.created_for) {
    return res.json(500, { error: 'No Created For specified'});
  }*/

  var message = {
    conversation_id: req.body.conversation_id,
    message: req.body.message,
    attachments: [],
    created_by: user._id,
    created_for: req.body.created_for,
    in_reponse_to: req.body.in_reponse_to || null 
  };

  if (user.role) {
    message.type = 'e2c';
  }

  Message.create(message, function(err, message) {
    if(err) { return handleError(res, err); }
    return res.json(201, message);
  });
};

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
  return res.send(500, err);
}


// TODO: Apply a lot of Secrecy over here
exports.indexCustomer = function(req, res) {
  // TODO: Check whether correct customer
  var limit = parseInt(req.query.limit) || defaults.limit;
  var skip = parseInt(req.query.skip) || defaults.skip;

  Message
    .find({
      conversation_id: mongoose.Types.ObjectId(req.query.conversation_id)
    })
    .skip(skip)
    .limit(limit)
    .populate('created_by')
    .sort('-createdAt')
    .exec(function (err, messages) {
      if(err) { return handleError(res, err); }
      return res.json(200, messages);
    });
}