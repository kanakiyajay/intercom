'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Message = require('./message.model');
var Customer = require('../customer/customer.model');
var Conversation = require('../conversation/conversation.model');
var Employee = require('../employee/employee.model');
var async = require('async');
var defaults = {
  skip: 0,
  limit: 10,
  cookieId: '__PIXEL_USER'
};

// Get list of messages sorted in reverse chronology
exports.index = function(req, res) {
  // TODO: Check whether correct customer
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
  // Else use req.customer
  var cookieId = req.cookies[defaults.cookieId];
  if (!cookieId) {
    return res.json(500, {
      "error": "Not Authenticated"
    });
  }

  Customer.find({
    client_id: req.client._id,
    cookie_id: cookieId
  }, function(err, customers) {
    if (err) handleError(res, err);
    if (!customers) {
      res.send(500, {
        error: 'No Customer found'
      });
    }

    var custId = customers[0]._id;
    console.log('req.client', req.client);

    if (!req.body.conversation_id) {
      Conversation.create({
        client_id: req.client._id,
        poc_kind: 'Employee',
        poc_id: req.client.primary,
        customer_id: custId
      }, function(err, conv) {
        if (err) {
          console.error('New Conversation Create', err);
        }
        console.log('New Conversation', conv);

        pushMsgToConversation(conv._id, custId, req, res);  
      });
    } else {
      pushMsgToConversation(req.body.conversation_id, custId, req, res);
    }
  });
};

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
    },
    conversation_id: req.body.conversation_id
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

function pushMsgToConversation(convId, custId, req, res) {
  var mesg = {
    conversation_id: convId,
    message: req.body.message,
    type: 'c2e',
    created_by: custId,
    created_by_model: 'Customer',
    status: 'unread',
    attachments: []
  };

  console.log("New Message from Customer", mesg);

  Message.create(mesg, function(err, message) {
    if (err) handleError(res, err);
    res.json(201, message);
  });
}