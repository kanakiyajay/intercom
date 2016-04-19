'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConversationSchema = new Schema({
  // initiated_by: { type: mongoose.Schema.Types.ObjectId },
  // initiated_by_model: String, // required for dynamic refs
  // TODO: For sending emails and pings to everyone involved
  stakeholders: [{
    kind: String, 
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'stakeholders.kind'} 
  }],
  // TODO: Is this required
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  // TODO: Is this required
  last_message: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'}
}, {
  timestamps: true
});

module.exports = mongoose.model('Conversation', ConversationSchema);