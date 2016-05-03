'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Message = require('../message/message.model');

var ConversationSchema = new Schema({
  // initiated_by: { type: mongoose.Schema.Types.ObjectId },
  // initiated_by_model: String, // required for dynamic refs
  
  // TODO: For sending emails and pings to everyone involved
  stakeholders: [{
    kind: String, 
    item: { type: mongoose.Schema.Types.ObjectId, refPath: 'stakeholders.kind' } 
  }],
  

  // TODO, Client Table and initial communication should be of client
  // Depending upon who replied change the poc_kind and poc_id
  poc_kind: { type: String, default: 'Employee', enum: ['Client', 'Employee'], required: true},

  // POINT OF CONTACT
  poc_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'poc_kind'},

  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]

}, {
  timestamps: true
});

ConversationSchema.virtual('last_message').get(function() {
  return this.messages[this.messages.length - 1];
});

module.exports = mongoose.model('Conversation', ConversationSchema);