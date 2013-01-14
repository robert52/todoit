var ProjectsRouter = function(app, resourceful, config, passport) {
  var resources = resourceful.resources;
  var User = resources.User;
  var Project = resources.Project;
  var api = config['api-url'];
  var grant = require('../features/grant');
  var hasAccess = grant.hasAccess;
  /**
   * Get all user's projects
   */
  app.get(api + '/projects', function(req, res) {
    Project.find({'owner_id' : req.user.id}, function(err, projects) {
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
    Project.collaborators(req.params.id, function(err, collaborators) {
      if (err) {
        throw err;
        
        res.json(500, err);
      }
            
      if(hasAccess(collaborators, req.user.id)) {
        Project.get(req.params.id, function(err, project) {
          if (!err) {
            res.json(200, project);
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
   * Create new project
   */
  app.post(api + '/projects/', function(req, res) {
    Project.create({
      owner_id: req.user.id,
      name: req.body.name,
      description: req.body.description,
      status: req.body.status || 'active'
    }, function(err, project) {
      Project.createCollaborator(project.id, {
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
    Project.collaborators(req.params.id, function(err, collaborators) {
      if (err) {
        throw err;
        
        res.json(500, err);
      }
      
      if(hasAccess(collaborators, req.user.id)) {
        Project.update(req.params.id, {
          name: req.body.name,
          description: req.body.description,
          status: req.body.status
        }, function(err, result) {
          if (!err) {
            res.json(200, result);
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
   * Delete project
   * 
   */
  app.del(api + '/projects/:id', function(req, res) {
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