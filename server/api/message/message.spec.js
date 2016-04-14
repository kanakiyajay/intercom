'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Message = require('./message.model');
var populate = require('../../config/seed');
var seed = populate.seed;

describe('Checking /api/messages for Employees', function() {

  describe('Authentication Errors', function() {
    it('should respond with authentication error', function(done) {
      request(app)
        .get('/api/messages')
        .expect(401)
        .expect('Content-Type', /html/)
        .expect(function(res) {
          res.text.should.equal('UnauthorizedError: No Authorization header was found');
        })
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});

describe('Login should be successful', function() {
    
  console.log('Initiating Seed Database');

  before(function(done) {
    populate.init(function() {
      console.log('Seed Database finished loading');
      done();
    });
  });
  
  var user = {
    email: seed.emplo2.email,
    password: seed.emplo2.password
  };

  var token;

  it('should be able to login successfully', function(done) {
    request(app)
      .post('/auth/local')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.property('token');
        res.body.token.should.have.lengthOf(180);
        token = res.body.token;
        done();
      });
  });

  it('GET /api/messages with authentication', function(done) {
    request(app)
      .get('/api/messages')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.an.instanceOf(Array);
        done();
      });
  });

});