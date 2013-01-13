/**
 * Important! Set the environment to test
 */
process.env.NODE_ENV = 'test';

var root = __dirname + '/../', 
    utils = require(root + 'lib/utils'),
    http = require('http'),
    resourceful = require('resourceful'),
    colors = require('colors'),
    chai = require('chai'), 
    should = chai.should(), 
    request = require('request'),
    api = '/api', 
    config, 
    db, 
    URL, 
    ENV;

config = utils.loadConfig();
ENV = process.env.NODE_ENV;
URL = utils.createBaseUrl(config['host'], config['port'], config['https']);

describe('Authentication::API'.yellow, function() {
  var User, 
      userObj = {
        email : 'john.doe@todoit.com',
        password : 'john!2345'
      };

  before(function(done) {
    db = resourceful.connection.connection;

    User = resourceful.resources.User;

    utils.cleanDb(db, done);
  });

  after(function(done) {
    utils.cleanDb(db, done);
  });

  describe('#User Login'.cyan, function() {
    
    before(function(done) {
      User.hashPassword(userObj.password, function(err, password, salt) {
        if (err) throw err;
        
        User.create({
          email: userObj.email,
          password: password,
          password_salt: salt
        }, function(err, user) {
          if (err) throw err;
          
          done();
        });
      });
    });
    
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
          username : userObj.email,
          password : userObj.password
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