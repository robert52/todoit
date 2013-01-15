var ProjectsRouter = function(app, schema, config, passport) {
  var User = schema.models.User;
  var Project = schema.models.Project;
  var Collaborator = schema.models.Collaborator
  var api = config['api-url'];
  var async = require('async');
  var grant = require('../features/grant');
  var hasAccess = grant.hasAccess;
  var NoAccessError = grant.NoAccessError;
  
  /**
   * Get all user's projects
   */
  app.get(api + '/projects', function(req, res) {
    Project.all({where: {'owner_id' : req.user.id}, order: 'id'}, function(err, projects) {
      if (!err) {
        res.json(200, projects);
      } else {
        throw err;
        
        res.json(500, err);
      }
    });
  });

  /**
   * Get a project by id 
   */
  app.get(api + '/projects/:id', function(req, res) {
    async.series({
      check_access: function(callback) {
        Project.collaborators(req.params.id, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }
          
          callback(err, 'done');
        });
      },
      get_project: function(callback) {
        Project.find(req.params.id, function(err, project) {
          callback(err, project);
        });
      }      
    }, function(err, results) {
      if (!err) {
        res.json(200, result.get_project);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }      
    });
    // Project.collaborators(req.params.id, function(err, collaborators) {
      // if (err) {
        // throw err;
//         
        // res.json(500, err);
      // }
//             
      // if(hasAccess(collaborators, req.user.id)) {
        // Project.get(req.params.id, function(err, project) {
          // if (!err) {
            // res.json(200, project);
          // } else {
            // throw err;
//             
            // res.json(500, err);
          // }
        // });
      // } else {
        // res.json(401, {msg: 'No access!'});
      // }
    // });
  });

  /**
   * Create new project
   * 
   * TODO: need to delete project if collaborator adding fails
   */
  app.post(api + '/projects/', function(req, res) {
    Project.create({
      owner_id: req.user.id,
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || 'active'
    }, function(err, project) {
      Collaborator.create(project.id, {
        user_id: req.user.id,
        access: 'owner'
      }, function(err, collaborator) {
        if (!err) {
          res.setHeader('Location', api + '/projects/' + project.id);
          res.json(201, project);
        } else {
          throw err;
          
          res.json(500, err);
        }
      });
    });
  });

  /**
   * Update project
   * 
   */
  app.put(api + '/projects/:id', function(req, res) {
    async.auto({
      check_access: function(callback) {
        Project.collaborators(req.params.id, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }
          
          callback(err, 'done');
        });
      },
      get_project: ['check_access', function(callback, results) {
        Project.find(req.params.id, function(err, project) {
          callback(err, project);
        });
      }],
      update_project: ['get_project', function(callback, results) {
        results.get_project.updateAttributes({
          name: req.body.name,
          description: req.body.description,
          status: req.body.status          
        }, function(err, project) {
          callback(err, project);
        });
      }]
    }, function(err, results) {
      if (!err) {
        res.json(200, result.update_project);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }      
    });
        
    // Project.collaborators(req.params.id, function(err, collaborators) {
      // if (err) {
        // throw err;
//         
        // res.json(500, err);
      // }
//       
      // if(hasAccess(collaborators, req.user.id)) {
        // Project.update(req.params.id, {
          // name: req.body.name,
          // description: req.body.description,
          // status: req.body.status
        // }, function(err, result) {
          // if (!err) {
            // res.json(200, result);
          // } else {
            // throw err;
//             
            // res.json(500, err);
          // }
        // });
      // } else {
        // res.json(401, {msg: 'No access!'});
       // }
    // });
  });

  /**
   * Delete project
   * 
   */
  app.del(api + '/projects/:id', function(req, res) {
    async.auto({
      check_access: function(callback) {
        Project.collaborators(req.params.id, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }
          
          callback(err, 'done');
        });
      },
      get_project: ['check_access', function(callback, results) {
        Project.find(req.params.id, function(err, project) {
          callback(err, project);
        });
      }],
      destroy_project: ['get_project', function(callback, results) {
        results.get_project.destroy(function(err) {
          callback(err, 'done');
        });
      }]
    }, function(err, results) {
      if (!err) {
        res.json(204, {});
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }      
    });
    
    Project.collaborators(req.params.id, function(err, collaborators) {
      if (err) {
        throw err;
        
        res.json(500, err);       
      }
      
      if(hasAccess(collaborators, req.user.id)) {
        Project.destroy(req.params.id, function(err) {
          if (!err) {
            res.json(200, {
              status: 'ok',
              msg: 'resource deleted successfully'
            });
          } else {
            throw err;
            
            res.json(500, err);
          }
        });
      } else {
        res.json(401, {msg: 'No access!'});
      }
    });
  });

  /**
   * Add collaborator
   * 
   */
  app.post(api + '/projects/collaborators', function(req, res) {
    Project.collaborators(req.body.id, function(err, collaborators) {
      if (err) {
        throw err;
        
        res.json(500, err);
      }
      
      if(hasAccess(collaborators, req.user.id)) {
        Project.createCollaborator(req.body.id, {
          user_id: req.body.user_id,
          access: req.body.access
        }, function(err, collaborator) {
          if (!err) {
            res.json(201, collaborator);
          } else {
            throw err;
            
            res.json(500, err);
          }  
        });
      } else {
        res.json(401, {msg: 'No access!'});
      }
    }); 
  });
};

module.exports = ProjectsRouter;