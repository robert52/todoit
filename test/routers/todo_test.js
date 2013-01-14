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
    API_URL,
    ENV;

config = utils.loadConfig();
api = config['api-url'];
ENV = process.env.NODE_ENV;
URL = utils.createBaseUrl(config['host'], config['port'], config['https']);
API_URL = URL + api;

describe('Todo::API'.yellow, function() {
  var User, Project, Todo, projectId, userId, seconduserId, todoId;
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
      async.auto({
        hash_password: function(callback) {
          User.hashPassword(mockUser.password, function(err, password, salt) {
            if (err) throw err;

            callback(null, {
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
              if (err) throw err;

              seconduserId = anotherUser.id
            
              callback(null, {
                user_one: user,
                user_two: anotherUser
              });
            });            
          });
        }],
        create_project: ['create_users', function(callback, result) {
          Project.create({
            owner_id: result.create_users.user_one.id,
            name: 'Test project',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
            status: 'active'
          }, function(err, project) {
            if (err) throw err;
            
            projectId = project.id;
            
            callback(null, project);
          });          
        }],
        add_collaborator: ['create_project', function(callback, result) {
          Project.createCollaborator(result.create_project.id, {
            user_id: userId,
            access: 'owner'
          }, function(err, collaborator) {
            if (err) throw err;
            
            callback(null, collaborator);
          });          
        }],
        create_todo: ['create_project', 'add_collaborator', function(callback, result) {
          Project.createTodo(result.create_project.id, {
            title: 'Test todo',
            completed: false,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur ornare risus.',
            assignee_id: result.add_collaborator.id
          }, function(err, todo) {
            if (err) throw err;
            
            todoId = todo.id;
            
            callback(null, todo);
            done();            
          });
        }]
      });
    });
  });
  
  after(function(done) {
    utils.cleanDb(db, done);
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
    
    it('should not create a todo if user is not part of the collaborators', function(done) {
      request({
        method: 'POST',
        url: API_URL + '/todos/',
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
});