'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Customers which are going to be tracked
 * In this website id and website customer id should be unique together
 * @type {Schema}
 */
var CustomerSchema = new Schema({
  web_cust_id: String,
  //web_id: String, // foreign key
  name: String,
  email: String,

  /**
   * User Meta information from the browser
   **/
  location: {
    lat: String,
    long: String,
    country: String,
    city: String,
    pin: String,
  },
  screen: {
    width: Number,
    height: Number
  },
  platform: String, // MAC / WINDOWS / LINUX / ANDROID / IOS
  browser: String,
  language: String,
  timezone: String,

  // Should be updated everytime customer tracks
  last_active_at: Date,

  // Last message given
  last_contacted_at: Date,
  created_at: Date, // This comes from the website

  facebook_id: String,
  twitter_id: String,

  // TODO: How to capture this ?
  web_sessions: { type: Number, default: 0},
  
  // Custom User Attributes in Intercom
  attributes: Object
}, {
	timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);