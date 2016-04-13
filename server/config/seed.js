/**
 * Populate DB with sample data on server start
 * First Populating:
 *    Employees
 *    Messages
 *    
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Emp = require('../api/employee/employee.model');
var Message = require('../api/message/message.model');

Emp.find({}).remove(function() {
  Emp.create({
    provider: 'local',
    name: 'Test Emp',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function(err, emp1, emp2) {
      console.log('finished populating users');
      Message.find({}).remove(function() {
        Message.create({
          status: 'unread',
          message: 'Hello World 1',
          created_for: emp1._id,
          created_by: emp2._id,
          attachments: []
        }, {
          status: 'unread',
          message: 'Hello World 2',
          created_for: emp2._id,
          created_by: emp1._id,
          attachments: []
        }, function (err, message) {
          console.log('finished populating messages');
        });
      });
    }
  );
});

