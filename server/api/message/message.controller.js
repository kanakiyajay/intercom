'use strict';

var _ = require('lodash');
var Message = require('./message.model');
var Customer = require('../customer/customer.model');
var Employee = require('../employee/employee.model');
var defaults = {
  skip: 0,
  limit: 10,
  status: 'unread'
};

// Get list of messages sorted in reverse chronology
exports.index = function(req, res) {

  // TODO: Set Hard Limits over here for minima and maxima
  var status = req.query.status || defaults.status;
  var limit = req.query.limit || defaults.limit;
  var skip = req.query.skip || defaults.skip;
  var messageFor, messageTo;

  // Requesting User is an Employee
  if (req.user.role) {
    messageFor = 'created_for';
    messageTo = 'created_by';
  } else {
    messageFor = 'created_by';
    messageTo = 'created_for';
  }

  Message
    .find({
      created_for: req.user._id,
      status: status
    })
    .skip(skip)
    .limit(limit)
    .sort('-createdAt')
    .populate({ path: messageTo, model: Customer})
    .populate({ path: messageFor, model: Employee})
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
exports.create = function(req, res) {
  var user = req.user;
  if (!req.body.created_for) {
    return res.json(500, { error: 'No Created For specified'});
  }

  var message = {
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