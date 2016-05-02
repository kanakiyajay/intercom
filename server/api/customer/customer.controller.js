'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');
var Message = require('../message/message.model');
var cookieID = '__PIXEL_USER';

exports.get = function(req, res) {
  Customer.find(function (err, customer) {
    if(err) { return handleError(res, err); }
    return res.json(200, customers);
  });
};

// CORS is enabled in this
// Gets the current customer based upon the params sent
// If no customer is found, a new one is created with its own unique id
// 
// req.body.settings: {
//  client_id
//  cust_id
//  name
//  email
// }
// 
// Creates or return a customer in the DB.
exports.create = function(req, res) {
  var mQuery = getCustomerQuery(req);
  console.log('mQuery', mQuery);
  if (mQuery) {

    // TODO: Also return the employee communicating with him
    Customer
      .findOne(mQuery)
      .populate({
        path: 'conversations',
        populate: {
          path: 'messages',
          options: {
            sort: {
              createdAt: -1
            },
            limit: 1
          }
        }
      })
      .exec(function(err, customer) {

        if (err) { return handleError(res, err); }

        if (!customer) {
          handleCustomer(req, res);
          return;
        }
        // Update BrowserInfo
        customer.browserInfo = req.body.browserInfo;

        // Update Customer Id
        if (!customer.cust_id && req.body.settings.cust_id) {
          customer.cust_id = req.body.settings.cust_id;
        }

        // Update Cookie Id
        if (!customer.cookie_id && req.body.cookie) {
          customer.cookie_id = req.body.cookie;
        }

        if (!customer.cookie_id && !req.body.cookie) {
          customer.cookie_id = getRandomString();
        }

        // Customer user Attributes
        _.extend(customer.attributes, req.body.settings.attributes || {});

        // Also Update the Customer
        customer.save(function(err, cust) {
          if (err) { return handleError(res, err); }
          res.json(201, cust);
        });
      });
  } else {
    handleCustomer(req, res);
  }
};

// Updates an existing customer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Customer.findById(req.params.id, function (err, customer) {
    if (err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    var updated = _.merge(customer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, customer);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function getCustomerQuery(req) {
  var settings = req.body.settings;
  if (settings.cust_id && settings.cust_id.length) {
    console.log('getCustomerQuery', 'Customer Id Present');
    return {
      client_id: settings.client_id,
      cust_id: settings.cust_id
    }
  } else if (req.cookies[cookieID] && req.cookies[cookieID].length) {
    var cke = req.cookies[cookieID];
    console.log('getCustomerQuery', 'Cookie Id Present', cke);
    return {
      client_id: settings.client_id,
      cookie_id: cke
    }
  } else {
    console.log('getCustomerQuery', 'Create a New Customer');
    return false;
  }
}

function getRandomString() {
  return Math.random().toString(36).slice(2);
}

function handleCustomer(req, res) {
  console.log('Create a new Customer');
  var mCustomer = {
    client_id: req.body.settings.client_id,
    cookie_id: getRandomString(),
    name: req.body.settings.name || '',
    email: req.body.settings.email || '',
    browserInfo: req.body.browserInfo || {},
    attributes: req.body.settings.attributes || {}
  }

  if (!mCustomer.client_id) {
    return handleError(res, new Error('No Client Id present'));
  }

  if (req.body.settings.cust_id) {
    mCustomer.cust_id = req.body.settings.cust_id;
  }

  Customer.create(mCustomer, function(err, customer) {
    if(err) { return handleError(res, err); }
    return res.json(201, customer);
  });
}

function populateConversations(conversations) {
  conversations.forEach(function(conv) {
    if (conv.messages.length) {
      conv.last_message = conv.messages[conv.messages.length - 1];
      console.log(conv.last_message);
    }
  });
  return conversations;
}