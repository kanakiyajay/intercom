'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Message = require('../message/message.model'),
    Employee = require('../employee/employee.model'),
    Customer = require('../customer/customer.model');

var ConversationSchema = new Schema({
  stakeholders: [{
    model: String, 
    _id: { type: mongoose.Schema.Types.ObjectId, refPath: 'stakeholders.model' } 
  }],
  
  client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true},
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer'},

  /**
   * TODO:
   *  Pre save hook for default poc for every conversation
   *  change conversation depeding upon who replied
   */
  poc_kind: { type: String, default: 'Employee', enum: ['Client', 'Employee'], required: true},
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
  if (conv.poc_kind === 'Employee') {
    Employee.findById(conv.poc_id, function(err, emp) {
      if (!emp) return;
      if (emp.conversations.indexOf(conv._id) === -1) {
        emp.conversations.push(conv._id);
        emp.save();
      }
    });
  } else {
    // POC KIND IS WEBSITE
    // TODO: Find the client id and primary employee and save
  }

  Customer.findById(conv.customer_id, function(err, cust) {
    if (cust.conversations.indexOf(conv._id) === -1) {
      cust.conversations.push(conv._id);
      cust.save();
    }
  });
});

module.exports = mongoose.model('Conversation', ConversationSchema);