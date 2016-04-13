'use strict';

var should = require('should');
var app = require('../../app');
var Employee = require('./epm.model');

var employee = new Employee({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

describe('Employee Model', function() {
  before(function(done) {
    // Clear users before testing
    Employee.remove().exec().then(function() {
      done();
    });
  });

  afterEach(function(done) {
    Employee.remove().exec().then(function() {
      done();
    });
  });

  it('should begin with no users', function(done) {
    Employee.find({}, function(err, users) {
      users.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate employee', function(done) {
    employee.save(function() {
      var userDup = new Employee(employee);
      userDup.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without an email', function(done) {
    employee.email = '';
    employee.save(function(err) {
      should.exist(err);
      done();
    });
  });

  it("should authenticate employee if password is valid", function() {
    return employee.authenticate('password').should.be.true;
  });

  it("should not authenticate employee if password is invalid", function() {
    return employee.authenticate('blah').should.not.be.true;
  });
});
