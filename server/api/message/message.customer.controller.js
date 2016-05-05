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

    if (!req.body.conversation_id) {
      console.log('New Conversation');
      // TODO: Insert client id over here
      Conversation.create({
        client_id: req.client._id,
        poc_kind: 'Employee',
        poc_id: req.client.primary
      }, function(err, conv) {
        pushMsgToConversation(conv._id, customers[0], req, res);  
      });
    } else {
      pushMsgToConversation(req.body.conversation_id, customers[0], req, res);
    }
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

function handleError(res, err) {
  console.error(err);
  return res.send(500, err);
}

function pushMsgToConversation(convId, cust, req, res) {
  var mesg = {
    conversation_id: convId,
    message: req.body.message,
    type: 'c2e',
    created_by: cust._id,
    created_by_model: 'Customer',
    status: 'unread',
    attachments: []
  };

  console.log("New Message from Customer", mesg);

  Message.create(mesg, function(err, message) {
    if (err) handleError(res, err);
    var mesgId = message._id;
    updateConversation(convId, message, function() {
      pushConvToCustomer(convId, cust, function() {
        pushConvToClient(req.client, convId, function() {
          res.json(201, message);
        })
      });
    });
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

function pushConvToClient(client, convId, cb) {
  Employee.findById(client.primary, function(err, emp) {
    if (emp.conversations.indexOf(convId) === -1) {
      emp.conversations.push(convId);
      emp.save(cb);
    } else {
      cb(null, emp);
    }
  });
}

function updateConversation(convId, message, cb) {
  console.log("updateConversation", convId);
  Conversation.findById(convId, function(err, conversation) {
    console.log(err, conversation);
    if (conversation.messages.indexOf(message._id) === -1) {
      conversation.messages.push(message._id);
      conversation.save(cb);
    } else {
      cb(null, conversation);
    }
  });
}