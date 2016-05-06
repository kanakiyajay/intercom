'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Conversation = require('../conversation/conversation.model'),
    _ = require('lodash');

/*********
 *  Currently putting all messages under 1 conversation
 *  Message Type defines whom the messag was intended for
 *  This is then used dynamically to find the website / customer / employee
 *    - e2c: Employee to Customer
 *    - c2e: Customer to Employee
 *    - c2w: Customer to website
 *    
 *********/
var MessageSchema = new Schema({
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', index: true},
  status: { type: String, enum: ['read', 'unread', 'deleted'], required: true, default: 'unread'},
  created_by_model: { type: String, enum: ['Customer', 'Employee', 'Client']}, // Required for dynamic refs
  created_by: { type: mongoose.Schema.Types.ObjectId, refPath: 'created_by_model'},
  type: { type: String, enum: ['e2c', 'c2e', 'c2w'], required: true},

  // TODO: Might be required for threading
  in_response_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
  message: { type: String, trim: true, required: true },
  // TODO: Using this later in order to attach pics, pdfs, etc
  attachments: Array
}, {
  timestamps: true
});

// Update Stakeholders in Conversation
MessageSchema.post('save', function() {
  var message = this;
  Conversation.findById(message.conversation_id, function(err, conv) {
    var isPresent = _.findIndex(conv.stakeholders, { id: message.created_by });
    if (isPresent === -1) {
      conv.stakeholders.push({
        model: message.created_by_model,
        _id: message.created_by
      });
      conv.save();
    }
  });  
});

module.exports = mongoose.model('Message', MessageSchema);