'use strict';

var _ = require('lodash');
var mongoose = require('mongoose');
var Conversation = require('./conversation.model');
var Message = require('../message/message.model');

// Get a list of conversations and its corresponsing messages
exports.index = function(req, res) {
  if (!req.body.conversations) {
    return res.json(200, {});
  }
  
  var arr = req.body.conversations;
  var queryArr = arr.map(function(id){ return mongoose.Types.ObjectId(id); })

  Message.aggregate([{
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
    "$group": {
      "_id": "$conversation_id",
      "messages": {
        "$push": "$$ROOT"
      }
    }
  }, {
    "$sort": {
      "createdAt": -1
    }
  }, {
    $limit: 10
  }]).exec(function(err, resp) {
    if (err) { return handleError(res, err); }
    res.json(200, resp);
  })
};

function handleError(res, err) {
  return res.send(500, err);
}