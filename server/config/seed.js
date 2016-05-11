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
var Client = require('../api/client/client.model');
var clientId = mongoose.Types.ObjectId();

function init(cb) {
  async.parallel([
    populateClients,
    populateCustomers,
    populateEmployees,
    populateConversations
  ], function(err, results) {
    populateMessages(err, results, cb);
  });
}

// TODO: Create a seperate json file for this 
var seedJson = {
  client: {
    _id: clientId,
    url: 'http://jquer.in/',
    profile_pic: 'http://jquer.in/favicons/favicon.ico',
    name: 'jQuer.in',
    app_id: 'rkgCVDuZ'
  },
  emplo1: {
    client_id: clientId,
    provider: 'local',
    name: 'Katelyn Friedson',
    profile_pic: 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg',
    password: 'test'
  },
  emplo2: {
    client_id: clientId,
    provider: 'local',
    role: 'admin',
    name: 'Chad Engle',
    email: 'admin@admin.com',
    profile_pic: 'https://s3.amazonaws.com/uifaces/faces/twitter/chadengle/128.jpg',
    password: 'admin',
    conversations: []
  },
  custo1: {
    client_id: clientId,
    app_id: 'rkgCVDuZ',
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
    client_id: clientId,
    app_id: 'rkgCVDuZ',
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
  },
  conv: {
    client_id: clientId,
    poc_kind: 'Employee'
  }
};

function populateClients(cb) {
  Client.find({}).remove(function() {
    Client.create(seedJson.client, cb);
  });
}

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
    Conversation.create(seedJson.conv, cb);
  });
}

function createMessages(msg1, msg2, cb) {
  Message.find({}).remove(function() {
    Message.create(msg1, msg2, function (err) {
      if (err) { console.error(err); }
        console.log('Finished populating Employees');
        console.log('Finished populating Customers');
        console.log('Finished populating messages');
        console.log('Finished populating Conversations');
        if (typeof cb === "function") cb();
    });
  });
}

function populateMessages(err, results, cb) {
  if (err) { console.error(err); }
  // results is an array of clients
  var cust = results[1][1];
  var emp = results[2][1];
  var conv = results[3];

  var msg1 = seedJson.mess1;
  var msg2 = seedJson.mess2;

  msg1.created_by = cust._id;
  msg1.conversation_id = conv._id;
  msg1.created_by_model = 'Customer';

  msg2.created_by = emp._id;
  msg2.conversation_id = conv._id;
  msg2.created_by_model = 'Employee';

  conv.poc_id = emp._id;
  conv.save(function() {
    createMessages(msg1, msg2, cb);
  });
}

module.exports = {
  init: init,
  seed: seedJson
}