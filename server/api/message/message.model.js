'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/*********
 *
 *  Message Type defines whom the messag was intended for
 *  This is then used dynamically to find the website / customer / employee
 *    - e2c: Employee to Customer
 *    - c2e: Customer to Employee
 *    - c2w: Customer to website
 *    
 *********/
var MessageSchema = new Schema({
  status: { type: String, enum: ['read', 'unread', 'deleted']},
  created_for: { type: mongoose.Schema.Types.ObjectId},
  created_by: { type: mongoose.Schema.Types.ObjectId, required: true},
  message_type: { type: String, enum: ['e2c', 'c2e', 'c2w'], required: true},

  // TODO: Might be required for threading
  in_response_to: { type: mongoose.Schema.Types.ObjectId, ref: 'Message'},
  message: { type: String, trim: true, required: true },
  // TODO: Using this later in order to attach pics, pdfs, etc
  attachments: Array
}, {
  timestampes: true
});



module.exports = mongoose.model('Message', MessageSchema);