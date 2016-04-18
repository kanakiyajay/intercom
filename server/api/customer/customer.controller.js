'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');

exports.get = function(req, res) {
  Customer.find(function (err, customer) {
    if(err) { return handleError(res, err); }
    return res.json(200, customers);
  });
};

// Get a single customer
exports.show = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    return res.json(customer);
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
// Creates a new customer in the DB.
exports.create = function(req, res) {
  var mQuery = getCustomerQuery(req);
  if (mQuery) {
    Customer.findOne(mQuery, function(err, customer) {
      if (err) { return handleError(res, err); }

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
        res.json(201, customer);
      });
    });
  } else {
    var mCustomer = {
      client_id: req.body.settings.client_id,
      cookie_id: getRandomString(),
      name: req.body.settings.name || '',
      email: req.body.settings.email || '',
      browserInfo: req.body.browserInfo || {},
      attributes: req.body.settings.attributes || {}
    }

    if (!mCustomer.client_id) {
      return handleError(res, Error('No Client Id present'));
    }

    if (req.body.settings.cust_id) {
      mCustomer.cust_id = req.body.settings.cust_id;
    }

    Customer.create(mCustomer, function(err, customer) {
      if(err) { return handleError(res, err); }
      return res.json(201, customer);
    });
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

// Deletes a customer from the DB.
exports.destroy = function(req, res) {
  Customer.findById(req.params.id, function (err, customer) {
    if(err) { return handleError(res, err); }
    if(!customer) { return res.send(404); }
    customer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}

function getCustomerQuery(req) {
  var settings = req.body.settings;
  if (settings.cust_id && settings.cust_id.length) {
    return {
      client_id: settings.client_id,
      cust_id: settings.cust_id
    }
  } else if (req.body.cookie && req.body.cookie.length) {
    return {
      client_id: settings.client_id,
      cookie_id: req.body.cookie
    }
  } else {
    return false;
  }
}

function getRandomString() {
  return Math.random().toString(36).slice(2);
}