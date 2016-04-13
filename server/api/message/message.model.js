'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  status: { type: String, enum: ['read', 'unread', 'deleted']},
  /*********
   *
   *  How to link a message to a website for first contact ?
   *
   *********/
  created_for: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true},
  in_response_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
  message: { type: String, trim: true, required: true },
  attachments: Array
}, {
  timestampes: true
});



module.exports = mongoose.model('Message', MessageSchema);