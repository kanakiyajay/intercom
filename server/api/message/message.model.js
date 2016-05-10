'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Conversation = require('../conversation/conversation.model'),
    Employee = require('../employee/employee.model'),
    Customer = require('../customer/customer.model'),
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
// Update Messages in Conversation
// Depending upon who created it, populate its conversations if not present

MessageSchema.post('save', function() {
  var message = this;
  Conversation.findById(message.conversation_id, function(err, conv) {

    var isPresent = false;

    for (var i = conv.stakeholders.length - 1; i >= 0; i--) {
      if (conv.stakeholders[i]._id === message.created_by) {
        isPresent = true;
        break;
      }
    }

    if (!isPresent) {
      conv.stakeholders.push({
        model: message.created_by_model,
        _id: message.created_by
      });
    }

    if (conv.messages.indexOf(message._id) == -1) {
      conv.messages.push(message._id);
    }

    conv.save();

    if (message.created_by_model === 'Employee') {
      Employee.findById(message.created_by, function(err, emp) {
        if (emp.conversations.indexOf(conv._id) === -1) {
          emp.conversations.push(conv._id);
          emp.save();
        }
      });
    } else if (message.created_by_model === 'Customer') {
      Customer.findById(message.created_by, function(err, cust) {
        cust.conversations.push(conv._id);
        cust.save();
      });
    }
  });
});

module.exports = mongoose.model('Message', MessageSchema);