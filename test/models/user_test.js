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
var expect = chai.expect;
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

  describe('#Create User'.cyan, function() {
    it('should not create for an invalid email', function(done) {
      var newUser = User.create({
        email : 'john.doe@todos',
        password : 'john!2345'
      }, function(err, result) {
        err.should.not.equal(null);
        done();
      });
    });
    
    it('should not create if an email exists', function(done) {
      async.series({
        create_ok: function(callback) {
          User.create({
            email : 'john.doe@todos.com',
            password : 'john!2345',
            password_salt: '1234'
          }, function(err, result) {
            //err.should.equal(null);
            expect(err).to.equal(null);
            callback(err, result);
          });          
        },
        create_fail: function(callback) {
          User.create({
            email : 'john.doe@todos.com',
            password : 'john!2345',
            password_salt: '1234'
          }, function(err, result) {
            expect(err).to.not.equal(null);
            expect(err.message).to.equal('Validation error');

            callback(err, result);
          });          
        }
      }, function(err, results) {
        done();
      });
    });
  });

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
