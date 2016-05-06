'use strict';

var _ = require('lodash');
var Customer = require('./customer.model');
var Message = require('../message/message.model');
var Conversation = require('../conversation/conversation.model');
var cookieID = '__PIXEL_USER';

// CORS is enabled in this
// This is the first call
exports.create = function(req, res) {
  var customer = req.customer;
  var client = req.client;
  console.log('Customer Request', customer);
  
  customer = updateCustomer(customer, req);

  if (customer.conversations.length) {
    Conversation
      .populate(customer.conversations, [{
        path: 'poc_id',
        options: {
          select: '-salt -hashedPassword -conversations'
        }
      }], function(err, convs) {

        if (err) { return handleError(res, err); }

        // Also Update the Customer
        customer.save(function(err, cust) {
          if (err) { return handleError(res, err); }
          var resp = cust.toObject();
          
          // TODO: Remove many params from this    
          resp.client = req.client;

          res.json(201, resp);
        });
      });
  } else {
    console.log('Customer has no conversations');
    customer.save(function(err, cust) {
      if (err) { return handleError(res, err); }
      cust.client = req.client;
      res.json(201, cust);
    });
  }
};

// Get the customers of a client / employee
exports.get = function(req, res) {

  var query = {
    client_id: req.user.client_id
  };

  // To get a single customer
  if (req.query.customerId) {
    query._id = req.query.customerId;
  }

  Customer
    .find(query)
    .exec(function(err, customers) {
      if (err) {
        handleError(res, err);
      }

      if (!customers) {
        // TODO: Link to add new customers
      }

      res.json(customers);
    });
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
  console.error(err);
  return res.send(500, err);
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

function updateCustomer(customer, req) {
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

  if (req.body.settings.name) {
    customer.name = req.body.settings.name;
  }

  if (req.body.settings.email) {
    customer.email = req.body.settings.email;
  }

  // Customer user Attributes
  _.extend(customer.attributes, req.body.settings.attributes || {});
  return customer;
}