'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    shortid = require('shortid');

var ClientSchema = new Schema({
  app_id: { type: String, default: shortid.generate},

  name: { type: String, required: true},

  // TODO: Validate url check
  url: { type: String, lowercase: true, required: true},

  // The default profile pic that will be shown to the customer
  profile_pic: String,

  // Message to show to user when clicked on a new conversation
  pre_message: String,

  // Whether to show a striking message to user
  popup: { type: Boolean, default: false},

  // Whether to show an auto reply message to everyone
  auto_reply: { type: Boolean, default: false},

  // A pop up message which will be shown to new customers
  popup_message: String,

  // An Email reply that will be shown customers after first message
  auto_reply_message: String,

  // TODO
  plan: { type: String, enum: ['basic', 'advanced'], default: 'basic'},
  status: { type: String, enum: ['active', 'inactive'], default: 'active'},

  // This will be the superadmin employee
  primary: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee'},

  // This should get automatically populated
  employees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employee'}],

  // This should get automatically populated
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer'}]

}, {
  timestamps: true
});

module.exports = mongoose.model('Client', ClientSchema);