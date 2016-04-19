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

var mongoose = require('mongoose');
var async = require('async');
var Emp = require('../api/employee/employee.model');
var Message = require('../api/message/message.model');
var Customer = require('../api/customer/customer.model');
var Conversation = require('../api/conversation/conversation.model');

function init(cb) {
  async.parallel([
    populateCustomers,
    populateEmployees,
    populateConversations
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
    password: 'admin',
    conversations: []
  },
  custo1: {
    client_id: 'abcdef',
    cust_id: '123',
    name: 'Test Cust',
    email: 'cust@cust.com',

    last_active_at: new Date(),
    facebook_id: 'jay',
    twitter_id: 'techiejayk',

    attributes: {
      plan: 'premium'
    },

    conversations: []
  },
  custo2: {
    client_id: 'abcdef',
    cust_id: '124',
    name: 'Test Cust 2',
    email: 'cust2@cust.com',

    last_active_at: new Date(),
    facebook_id: 'jay2',
    twitter_id: 'ng_directives',

    attributes: {
      plan: 'basic'
    },

    conversations: []
  },
  mess1: {
    status: 'unread',
    message: 'Hello World 1',
    type: 'c2e',
    attachments: []
  },
  mess2: {
    status: 'unread',
    message: 'Hello World 2',
    type: 'e2c',
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

function populateConversations(cb) {
  Conversation.find({}).remove(function() {
    Conversation.create({}, cb);
  });
}

function populateMessages(err, results, cb) {
  if (err) { console.error(err); }
  var cust = results[0][0];
  var emp = results[1][1];
  var conv = results[2];

  var msg1 = seedJson.mess1;
  var msg2 = seedJson.mess2;

  msg1.created_for = emp._id;
  msg1.created_by = cust._id;
  msg1.conversation_id = conv._id;
  msg1.created_by_model = 'Customer';

  msg2.created_for = cust._id;
  msg2.created_by = emp._id;
  msg2.conversation_id = conv._id;
  msg2.created_by_model = 'Employee';

  Message.find({}).remove(function() {
    Message.create(msg1, msg2, function (err, message, message2) {
      if (err) { console.error(err); }

      conv.stakeholders = [ { kind: 'Employee', item: emp._id}, { kind: 'Customer', item: cust._id} ];

      conv.messages = [message._id, message._id];
      conv.last_message = message._id;
      conv.save(function(err, conv) {
        console.log('Finished populating Employees');
        console.log('Finished populating Customers');
        console.log('Finished populating messages');
        console.log('Finished populating Conversations');
        if (typeof(cb) === 'function') cb();
      });
    });
  });
}

function completeSeeding(err, cb) {
  // body...
}

module.exports = {
  init: init,
  seed: seedJson
}