'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Message = require('./message.model');

var message = {

}

describe('GET /api/messages', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/messages')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });

  it('should fail when trying to enter new message without a user id', function(done) {
    done();
  });

  it('should successfully retrieve correct message', function(done) {
    done();
  });

});