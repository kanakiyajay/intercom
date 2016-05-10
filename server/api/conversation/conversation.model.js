'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Message = require('../message/message.model'),
    Employee = require('../employee/employee.model');

var ConversationSchema = new Schema({
  stakeholders: [{
    model: String, 
    _id: { type: mongoose.Schema.Types.ObjectId, refPath: 'stakeholders.model' } 
  }],
  
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },

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

// Update Conversations of the primary employee
ConversationSchema.post('save', function() {
  var conv = this;
  if (conv.poc_id) {
    Employee.findById(conv.poc_id, function(err, emp) {
      if (emp.conversations.indexOf(conv._id) === -1) {
        emp.conversations.push(conv._id);
        emp.save();
      }
    });
  }
});

module.exports = mongoose.model('Conversation', ConversationSchema);