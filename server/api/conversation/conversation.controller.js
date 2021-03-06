'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Conversation = require('./conversation.model');
var Message = require('../message/message.model');
var Customer = require('../customer/customer.model');
var Employee = require('../employee/employee.model');
var defaults = {
  limit: 20
}

// Get a list of conversations and its corresponsing messages
exports.index = function(req, res) {
  Conversation
    .find({
      stakeholders: {
        model: 'Employee',
        _id: mongoose.Types.ObjectId(req.user._id)
      }
    })
    .populate([{
      path: 'messages',
      options: {
        limit: 20
      }
    }, {
      path: 'customer_id'
    }])
    .sort({
      updatedAt: -1
    })
    .exec(function(err, convs) {
      res.json(200, convs);
    });
};

function handleError(res, err) {
  console.error(err);
  return res.send(500, err);
}

/**
 *  Message.aggregate([{
    "$match": {
      "conversation_id": {
        "$in": queryArr
      }
    }
  },{
    "$lookup": {
      from: "customers",
      localField: "created_by",
      foreignField: "_id",
      as: "created_by"
    }
  }, {
    "$sort": {
      "createdAt": 1
    }
  }, {
    "$group": {
      "_id": "$conversation_id",
      "messages": {
        "$push": "$$ROOT"
      }
    }
  }, {
    $limit: limit
  }]).exec(function(err, resp) {
    if (err) { return handleError(res, err); }
    // Add last message
    // Add customer
    resp.forEach(function(conv) {
      conv.last_message = conv.messages[conv.messages.length - 1];
      for (var i = conv.messages.length - 1; i >= 0; i--) {
        if (conv.messages[i].type === 'c2e') {
          conv.customer = conv.messages[i].created_by[0];
          break;
        }
      }
    });
    res.json(200, resp);    
  });
 */