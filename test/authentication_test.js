/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

var root = __dirname + '/../';
var utils = require(root + 'lib/utils');
var http = require('http');
var colors = require('colors');
var chai = require('chai');
var should = chai.should();
var request = require('request');
var async = require('async');
var api;
var config;
var db;
var URL;
var ENV = process.env.NODE_ENV;
/**
 * Require app
 */
var appServer;
var app = require(root + 'app');

config = utils.loadConfig();
api = config['api_url'];
URL = utils.createBaseUrl(config['host'], config['port'], config['https']);

describe('Authentication::API'.yellow, function() {
  var models, User, Project, Collaborator, projectId, userId, seconduserId;
  var mockUser = {
    username: ['test@todoit.com', 'bob@todoit.com'],
    password: 'pass123'
  };

  before(function(done) {
    models = app.get('models');
    User = models.User;

    appServer = http.createServer(app);
        
    appServer.on('listening', function() {
      utils.cleanDb([User], function() {
        async.auto({
          hash_password: function(callback) {
            User.hashPassword(mockUser.password, function(err, password, salt) {
              callback(err, {
                password: password,
                salt: salt
              });
            });
          },
          create_users: ['hash_password', function(callback, result) {
            User.create({
              email: mockUser.username[0],
              password: result.hash_password.password,
              password_salt: result.hash_password.salt
            }, function(err, user) {
              if (err) throw err;
  
              userId = user.id
              
              User.create({
                email: mockUser.username[1],
                password: result.hash_password.password,
                password_salt: result.hash_password.salt
              }, function(err, anotherUser) {
                seconduserId = anotherUser.id
              
                callback(err, {
                  user_one: user,
                  user_two: anotherUser
                });
              });
            });
          }]
        }, function(err, results) {
          if (err) throw err;
          
          done();
        });
      });
    });
    
    appServer.listen(config.port);
  });

  after(function(done) {
    appServer.on('close', function() {
      setTimeout(done, 500);
    });
    utils.cleanDb([User], function() {
      appServer.close();
    });
  });

  describe('#User Login'.cyan, function() {
    
    after(function(done) {
      request({
        method : 'GET',
        url : URL + '/logout'
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(200);

        done();
      });
    });
    
    it('should pass for valid credentials', function(done) {
      request({
        method : 'POST',
        url : URL + '/login',
        form : {
          username : mockUser.username[0],
          password : mockUser.password
        }
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/dashboard');
        
        done();
      });
    });
  });
});