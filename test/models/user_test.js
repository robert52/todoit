/**
 * Set the environment to test
 */
process.env.NODE_ENV = 'test';

var root = __dirname + '/../../';
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

describe('User::Model'.yellow, function() {
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
      utils.cleanDb([User], done);
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

  // describe('#Create User'.cyan, function() {
    // it('should not create for an invalid email', function(done) {
      // var newUser = User.create({
        // email : 'john.doe@todos',
        // password : 'john!2345'
      // }, function(err, result) {
        // err.validate.errors[0].property.should.equal('email');
        // done();
      // });
    // });
  // });

  describe('#Check User credentials'.cyan, function() {
    before(function(done) {
      User.hashPassword(mockUser.password, function(err, password, salt) {
        if (err) throw err;
        
        User.create({
          'email' : mockUser.username[0],
          'password' : password,
          'password_salt' : salt
        }, function(err, user) {
          if (err)
            throw err;

          done();
        });
      });
    });

    it('should find the user for valid credentials', function(done) {
      User.checkCredentials(mockUser.username[0], mockUser.password, function(err, result) {
        result.should.not.equal(null);

        done();
      });
    });
  });
});
