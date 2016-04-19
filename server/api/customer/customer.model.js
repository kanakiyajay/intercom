'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Customers which are going to be tracked
 * In this website id and website customer id should be unique together
 * Also add cookie tracking id
 * @type {Schema}
 */
var CustomerSchema = new Schema({
  client_id: String, // TODO: Should be required

  // TODO: One or the other should always be present
  cust_id: String,
  cookie_id: String,

  name: String,
  email: String,

  /**
   * User Meta information from the browser
   * TODO: For location use https://github.com/bluesmoon/node-geoip
   **/
  location: {
    lat: String,
    long: String,
    country: String,
    city: String,
    pin: String,
  },

  browserInfo: {
    screenSize: String,
    browser: String,
    browserMajorVersion: String,
    mobile: Boolean,
    os: String,
    osVersion: String,
    language: String,
  },

  // TODO: jsTimeZoneOffset
  timezone: String,

  // Should be updated everytime customer tracks
  last_active_at: Date,

  // Last message given
  last_contacted_at: Date,
  created_at: Date, // This comes from the website

  facebook_id: String,
  twitter_id: String,

  // TODO: How to capture this ?
  web_sessions: { type: Number, default: 1},
  
  // Custom User Attributes in Intercom
  attributes: Object,

  conversations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'}]
  // conversations: [] // Will list all conversations that an customer has had
}, {
	timestamps: true
});

CustomerSchema.pre('validate', function(next) {
  if (!this.cust_id) {
    if (!this.cookie_id) {
      next(Error('Cookie Id or Customer Id should be present'));
    } else {
      next()
    }
  } else {
    next();
  }
})

module.exports = mongoose.model('Customer', CustomerSchema);