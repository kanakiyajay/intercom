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

      // Push to employee conversations
      if (emp.conversations.indexOf(conv._id) === -1) {
        console.log('Push Conversation', conv._id);
        emp.conversations.push(conv._id);
        emp.save();
      }

      var isPresent = false;

      for (var i = conv.stakeholders.length - 1; i >= 0; i--) {
        if (conv.stakeholders[i]._id === emp._id) {
          isPresent = true;
          break;
        }
      }

      if (!isPresent) {
        // Push to stakeholders
        conv.stakeholders.push({
          model: 'Employee',
          _id: emp._id
        });
      }

      conv.save();
    });
  } else {
    // POC KIND IS WEBSITE
    // TODO: Find the client id and primary employee and save
  }

  Customer.findById(conv.customer_id, function(err, cust) {
    // Push to customer conversations
    if (cust.conversations.indexOf(conv._id) === -1) {
      cust.conversations.push(conv._id);
      cust.save();
    }
  });
});

module.exports = mongoose.model('Conversation', ConversationSchema);