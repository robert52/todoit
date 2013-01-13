/**
 * Set the environment to test 
 */
process.env.NODE_ENV = 'test';

var root = __dirname + '/../../',
    utils = require(root + 'lib/utils'),
    http = require('http'),
    resourceful = require('resourceful'),
    colors = require('colors'),
    chai = require('chai'),
    should = chai.should(),
    request = require('request'),
    async = require('async'),
    api,
    config,
    db,
    URL,
    ENV;

config = utils.loadConfig();
api = config['api_url'];
ENV = process.env.NODE_ENV;
URL = utils.createBaseUrl(config['host'], config['port'], config['https']);


describe('Project::API'.yellow, function() {
  var User, Project, Todo, projectId, userId, seconduserId;
  var mockUser = {
    username: ['test@todoit.com', 'bob@todoit.com'],
    password: 'pass123'
  };
  
  before(function(done) {
    db = resourceful.connection.connection;

    User = resourceful.resources.User;
    Project = resourceful.resources.Project;
    Todo = resourceful.resources.Todo;
  
    utils.cleanDb(db, function() {
      User.hashPassword(mockUser.password, function(password, salt) {
        User.create({
          email: mockUser.username[1],
          password: password,
          password_salt: salt
        }, function(err, anotherUser) {
          if (err) throw err;

          seconduserId = anotherUser.id
        });        
        
        User.create({
          email: mockUser.username[0],
          password: password,
          password_salt: salt
        }, function(err, user) {
          if (err) throw err;

          userId = user.id;

          Project.create({
            owner_id: user.id,
            name: 'Test project',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
            status: 'active'
          }, function(err, project) {
            if (err) throw err;
            
            projectId = project.id;
            
            Project.createCollaborator(project.id, {
              user_id: user.id,
              access: 'owner'
            }, function(err, collaborator) {
              if (err) throw err;
              
              done();
            });
          });
        });
      });
    });
  });
  
});