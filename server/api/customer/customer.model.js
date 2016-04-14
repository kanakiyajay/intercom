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

  // Track the users last active location
  location: {
    lat: String,
    long: String,
    country: String,
    city: String,
    pin: String,
  },

  // Should be updated everytime customer tracks
  last_active_at: Date,
  created_at: Date, // This comes from the website

  facebook_id: String,
  twitter_id: String,

  // Custom User Attributes in Intercom
  attributes: Object
}, {
	timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);