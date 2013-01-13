/**
 * Important! Set the environment to test
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
  var User, Project, projectId, userId, seconduserId;
  var mockUser = {
    username: ['test@todoit.com', 'bob@todoit.com'],
    password: 'pass123'
  };
  
  before(function(done) {
    db = resourceful.connection.connection;

    User = resourceful.resources.User;
    Project = resourceful.resources.Project;

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
    
    it('should not get a project by id if user has no access', function(done) {
      request({
        method: 'GET',
        url: URL + '/api/projects/' + projectId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });
    });
    
    it('should not update a project', function(done) {
      request({
        method : 'PUT',
        url: URL + '/api/projects/' + projectId,
        form: {
          name: 'Updated project name',
          description: 'Updated description',
          status: 'active'          
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });
    });

    it('should not add collaborator', function(done) {
      request({
        method : 'POST',
        url: URL + '/api/projects/collaborators',
        form: {
          id: projectId,
          user_id: seconduserId,
          access: 'normal'          
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(401);
        
        done();
      });      
    });

    it('should not delete a project', function(done) {
      request({
        method : 'DELETE',
        url: URL + '/api/projects/' + projectId
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
    
    it('should get a project by id', function(done) {
      request({
        method: 'GET',
        url: URL + '/api/projects/' + projectId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(200);
        
        done();
      });
    });

    it('should update a project', function(done) {
      request({
        method : 'PUT',
        url: URL + '/api/projects/' + projectId,
        form: {
          name: 'Updated project name',
          description: 'Updated description',
          status: 'active'          
        }
      }, function(err, res, body) {
        if (err) throw err;

        res.statusCode.should.equal(200);
        
        done();
      });
    });

    it('should add collaborator to project', function(done) {
      request({
        method : 'POST',
        url: URL + '/api/projects/collaborators',
        form: {
          id: projectId,
          user_id: seconduserId,
          access: 'normal'          
        }
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(201);
        
        done();
      });
    });

    it('should delete a project', function(done) {
      request({
        method : 'DELETE',
        url: URL + '/api/projects/' + projectId
      }, function(err, res, body) {
        if (err) throw err;
        
        res.statusCode.should.equal(200);
        
        done();
      });
    });

  });
});
