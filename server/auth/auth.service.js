'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/employee/employee.model');
var Client = require('../api/client/client.model');
var Customer = require('../api/customer/customer.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Attach user to request
    .use(function(req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) {

          var error = {
            status: 401,
            code: 'NOT_AUTH',
            message: 'Not Authenticated',
            doc_link: '' // TODO
          };

          return res.json(401, error);
        }

        req.user = user;
        next();
      });
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.send(403);
      }
    });
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*60*5 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.json(404, { message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

function attachClient(req, res, next) {
  var error = {
    status: 500,
    code: 'NO_APP_ID',
    message: 'Add App Id',
    doc_link: ''
  };
  // Attach Client to the request
  var settings = req.body.settings;
  var appId = settings.app_id;
  if (!appId || !appId.length) {
    console.error('appId Not Present');
    return res.json(500, error);
  } else if (appId.length !== 8) {
    console.error('appId Improper Length', appId);
    return res.json(500, error);
  } else {
    Client.findOne({
      app_id: appId
    }, function(err, client) {
      if (err) { 
        console.error('Cannot Fetch Client', err);
        return res.json(500, err); 
      }
      if (!client) {
        console.error('No Client present in DB', appId, client);
        return res.json(500, {
          status: 500,
          code: 'NO_APP_ID',
          message: 'Add App Id',
          doc_link: ''
        });
      } else {
        req.client = client;
        next();
      }
    });
  }
}

function attachCustomer(req, res, next) {
  // req.client is already present
  var settings = req.body.settings;
  var query = {};

  if (settings.cust_id && settings.cust_id.length) {
    console.log('Customer Id Present');
    query = {
      client_id: req.client._id,
      cust_id: String(settings.cust_id)
    };
  } else if (req.cookies[cookieID] && req.cookies[cookieID].length) {
    var cke = req.cookies[cookieID];
    console.log('Cookie Id Present', cke);
    query = {
      client_id: req.client._id,
      cookie_id: cke
    };
  } else {
    query = false;
  }

  console.log('Customer DB Query', query);

  if (query) {
    Customer
      .findOne(query)
      .populate({
        path: 'conversations',
        populate: {
          path: 'messages',
          options: {
            sort: {
              createdAt: -1
            },
            limit: 1
          }
        }
      })
      .exec(function(err, customer) {
        if (err) {
          console.error('Customer Not Found', err);
          return res.json(500, {})
        }

        if (!customer) {
          console.log('No Customer Found');
          var cust = createCustomer(req);
          Customer.create(cust, function(err, customer) {
            if (err) {
              console.error('Customer Not Created', err);
              return res.json(500, err);
            }
            req.customer = customer;
            next();
          });
        } else {
          console.log('Customer Found', customer);
          req.customer = customer;
          next();
        }
      });
  } else {
    var cust = createCustomer(req);
    Customer.create(cust, function(err, customer) {
      if (err) {
        console.error('Customer Not Created', err);
        return res.json(500, err);
      }
      req.customer = customer;
      next();
    });
  }
}

function createCustomer(req) {
  var mCustomer = {
    client_id: req.client._id,
    cookie_id: getRandomString(),
    name: req.body.settings.name || '',
    email: req.body.settings.email || '',
    browserInfo: req.body.browserInfo || {},
    attributes: req.body.settings.attributes || {}
  }

  if (req.body.settings.cust_id) {
    mCustomer.cust_id = String(req.body.settings.cust_id);
  }
  return mCustomer;
}

// All Open ended endpoints should go through here
function openMiddleware() {
  return compose()
    .use(attachClient)
    .use(attachCustomer);
}

function getRandomString() {
  return Math.random().toString(36).slice(2);
}

exports.attachClient = attachClient;
exports.attachCustomer = attachCustomer;
exports.openMiddleware = openMiddleware;
exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;