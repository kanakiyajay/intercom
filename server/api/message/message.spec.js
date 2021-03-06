'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var Message = require('./message.model');
var Customer = require('../customer/customer.model');
var Conversation = require('../conversation/conversation.model');
var populate = require('../../config/seed');
var seed = populate.seed;

describe('Checking /api/messages for Employees', function() {

  describe('Authentication Errors', function() {
    it('GET /api/messages should respond with authentication error', function(done) {
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

    it('POST /api/messages should respond with authentication error', function(done) {
      request(app)
        .post('/api/messages')
        .send(seed.mess2)
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

describe('Checking all API with Authentication', function() {
    
  var user = {
    email: seed.emplo2.email,
    password: seed.emplo2.password
  };

  var token;
  var conversation;

  console.log('Initiating Seed Database');

  before(function(done) {
    populate.init(function() {
      console.log('Seed Database finished loading');
      Conversation.findOne().exec(function(err, conv) {
        console.log('Finished Quering for a conversation');
        conversation = conv;
        done();
      });
    });
  });  

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

  it('GET /api/messages with limit as one', function(done) {
    request(app)
      .get('/api/messages')
      .query({ limit: 1, conversation_id: conversation.id})
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.an.instanceOf(Array);
        res.body.should.have.lengthOf(1);
        done();
      });
  });

  it('POST /api/messages with authentication', function(done) {
      Customer.findOne().exec(function(err, customer) {
        if (err) return done(err);      
        var message = {
          conversation_id: conversation._id,
          message: 'Hello World 3',
          created_for: customer._id,
          created_by_model: "Employee",
          type: 'e2c'
        };

        request(app)
          .post('/api/messages')
          .set('Authorization', 'Bearer ' + token)
          .send(message)
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            console.log("RESPONSE", res);
            if (err) return done(err);
            res.body.message.should.be.equal(message.message);
            done();
          });
      });

  });

});