/**
 * Important! Set the environment to test
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
var API_URL;
var ENV = process.env.NODE_ENV;
/**
 * Require app
 */
var appServer;
var app = require(root + 'app');

config = utils.loadConfig();
api = config['api-url'];
URL = utils.createBaseUrl(config['host'], config['port'], config['https']);
API_URL = URL + api;

describe('Todo::API'.yellow, function() {
  var User, Project, Collaborator, Todo, projectId, userId, seconduserId, todoId, models;
  var mockUser = {
    username: ['test@todoit.com', 'bob@todoit.com'],
    password: 'pass123'
  };
  
  before(function(done) {
    models = app.get('models');
    User = models.User;
    Project = models.Project;
    Collaborator = models.Collaborator;
    Todo = models.Todo;
    
    appServer = http.createServer(app);
    appServer.on('listening', function() {  
      utils.cleanDb([User, Project, Collaborator, Todo], function() {
        async.auto({
          hash_password: function(callback) {
            User.hashPassword(mockUser.password, function(err, password, salt) {
              callback(err, {
                password: password,
                salt: salt
              });
            });
          },
          create_users: ['hash_password', function(callback, results) {
            User.create({
              email: mockUser.username[0],
              password: results.hash_password.password,
              password_salt: results.hash_password.salt
            }, function(err, user) {
              if (err) throw err;
  
              userId = user.id
              
              User.create({
                email: mockUser.username[1],
                password: results.hash_password.password,
                password_salt: results.hash_password.salt
              }, function(err, anotherUser) {
                seconduserId = anotherUser.id
              
                callback(err, {
                  user_one: user,
                  user_two: anotherUser
                });
              });            
            });
          }],
          create_project: ['create_users', function(callback, results) {
            Project.create({
              owner_id: results.create_users.user_one.id,
              name: 'Test project',
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
              status: 'active'
            }, function(err, project) {
              projectId = project.id;
              
              callback(err, project);
            });          
          }],
          add_collaborator: ['create_project', function(callback, results) {
            results.create_project.collaborators.create({
              user_id: userId,
              access: 'owner'  
            }, function(err, collaborator) {
              if (err) throw err;
              
              callback(err, collaborator);
            })
          }],
          create_todo: ['create_project', 'add_collaborator', function(callback, results) {
            results.create_project.todos.create({
              title: 'Test todo',
              completed: false,
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
              assignee_id: results.add_collaborator.id
            }, function(err, todo) {
              if (err) throw err;
              todoId = todo.id;
              
              callback(err, todo);
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
    utils.cleanDb([User, Project, Collaborator, Todo], function() {
      appServer.close();
    });
  });
  
  describe('#Unauthorized access'.cyan, function() {
    before(function(done) {
      request({
        method : 'POST',
        url : URL + '/login',
        form : {
          username : mockUser.username[1],
          password : mockUser.password
        }
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(302);
        res.headers.location.should.equal('/dashboard');
        
        done();
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

    it('should not get all todos of a project if user is not part of the collaborators', function(done) {
      request({
        method: 'GET',
        url: API_URL + '/todos/project/' + projectId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });
    });
    
    it('should not get a todo by id if user is not part of the collaborators', function(done) {
      request({
        method: 'GET',
        url: API_URL + '/todos/' + todoId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });      
    });
    
    it('should not create a todo for a project if user is not part of the collaborators', function(done) {
      request({
        method: 'POST',
        url: API_URL + '/todos/project/' + projectId,
        form: {
          title: 'Test todo'
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });      
    });
    
    it('should not be possible to update a todo if user is not part of the collaborators', function(done) {
      request({
        method: 'PUT',
        url: API_URL + '/todos/' + todoId,
        form: {
          title: 'Test todo',
          completed: false,
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });
    });
    
    it('should not delete a todo if user is not part of the collaborators', function(done) {
      request({
        method: 'DELETE',
        url: API_URL + '/todos/' + todoId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });      
    });
  });
  
  describe('#Authorized access'.cyan, function() {
    before(function(done) {
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

    it('should get all todos of a project if user is part of the collaborators', function(done) {
      request({
        method: 'GET',
        url: API_URL + '/todos/project/' + projectId
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        
        done();
      });
    });
    
    it('should get a todo by id if user is part of the collaborators', function(done) {
      request({
        method: 'GET',
        url: API_URL + '/todos/' + todoId
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        
        done();
      });      
    });
    
    it('should create a todo for a project if user is part of the collaborators', function(done) {
      request({
        method: 'POST',
        url: API_URL + '/todos/project/' + projectId,
        form: {
          title: 'Test todo'
        }
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(201);
        JSON.parse(body).title.should.equal('Test todo');
                
        done();
      });      
    });
    
    it('should be possible to update a todo if user is part of the collaborators', function(done) {
      request({
        method: 'PUT',
        url: API_URL + '/todos/' + todoId,
        form: {
          title: 'Test todo',
          completed: true
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(200);
        JSON.parse(body).title.should.equal('Test todo');
        JSON.parse(body).completed.should.equal('true');
        
        done();
      });
    });
    
    it('should delete a todo if user is part of the collaborators', function(done) {
      request({
        method: 'DELETE',
        url: API_URL + '/todos/' + todoId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(204);
        
        done();
      });      
    });
  });  
});