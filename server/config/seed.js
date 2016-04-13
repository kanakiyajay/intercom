/**
 * Populate DB with sample data on server start
 * First Populating:
 *    Users
 *    Messages
 *    
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Message = require('../api/message/message.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function(err, user1, user2) {
      console.log('finished populating users');
      Message.find({}).remove(function() {
        Message.create({
          status: 'unread',
          message: 'Hello World 1',
          created_for: user1._id,
          created_by: user2._id,
          attachments: []
        }, {
          status: 'unread',
          message: 'Hello World 2',
          created_for: user2._id,
          created_by: user1._id,
          attachments: []
        }, function (err, message) {
          console.log('finished populating messages');
        });
      });
    }
  );
});

