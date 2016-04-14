/**
 * Populate DB with sample data on server start
 * First Populating:
 *    Customers
 *    Employees
 *    Messages
 *    
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var async = require('async');
var Emp = require('../api/employee/employee.model');
var Message = require('../api/message/message.model');
var Customer = require('../api/customer/customer.model');

function init(cb) {
  async.parallel([
    populateCustomers,
    populateEmployees
  ], function(err, results) {
    populateMessages(err, results, cb);
  });
}

// TODO: Create a seperate json file for this 
var seedJson = {
  emplo1: {
    provider: 'local',
    name: 'Test Emp',
    email: 'test@test.com',
    password: 'test'
  },
  emplo2: {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  },
  custo1: {
    web_cust_id: '123',
    name: 'Test Cust',
    email: 'cust@cust.com',

    last_active_at: new Date(),
    facebook_id: 'jay',
    twitter_id: 'techiejayk',

    attributes: {
      plan: 'premium'
    }
  },
  custo2: {
    web_cust_id: '124',
    name: 'Test Cust 2',
    email: 'cust2@cust.com',

    last_active_at: new Date(),
    facebook_id: 'jay2',
    twitter_id: 'ng_directives',

    attributes: {
      plan: 'basic'
    }
  },
  mess1: {
    status: 'unread',
    message: 'Hello World 1',
    message_type: 'c2e',
    attachments: []
  },
  mess2: {
    status: 'unread',
    message: 'Hello World 2',
    message_type: 'e2c',
    attachments: []
  }
};

function populateEmployees(cb) {
  Emp.find({}).remove(function() {
    Emp.create(seedJson.emplo1, seedJson.emplo2, cb);
  });
}

function populateCustomers(cb) {
  Customer.find({}).remove(function() {
    Customer.create(seedJson.custo1, seedJson.custo2, cb);
  });
}

function populateMessages(err, results, cb) {
  if (err) { console.error(err); }
  var cust = results[0][0];
  var emp = results[1][1];

  var msg1 = seedJson.mess1;
  var msg2 = seedJson.mess2;

  msg1.created_for = emp._id;
  msg1.created_by = cust._id;

  msg2.created_for = cust._id;
  msg2.created_by = emp._id;

  Message.find({}).remove(function() {
    Message.create(msg1, msg2, function (err, message) {
      if (err) { console.error(err); }
      console.log('Finished populating Employees');
      console.log('Finished populating Customers');
      console.log('Finished populating messages');
      if (typeof(cb) === 'function') cb();
    });
  });
}

module.exports = {
  init: init,
  seed: seedJson
}