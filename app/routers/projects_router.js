var ProjectsRouter = function(app, resourceful, config, passport) {
	var resources = resourceful.resources,
      User = resources.User,
  		Project = resources.Project,
  		api = config['api-url'],
  		grant = require('../features/grant');
  
	/**
	 * Get all user's projects
	 */
	app.get(api + '/projects', function(req, res) {
	  Project.find({'owner_id' : req.user.id}, function(err, result) {
	    if (!err) {
	      res.json(200, result);
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
    Project.get(req.params.id, function(err, project) {
      if (!err) {
        if(grant(project.collaborator_ids, req.user.id)) {
          res.json(200, project);
        } else {
          res.json(401, {msg: 'No access!'});
        }
      } else {
        throw err;
        
        res.json(500, err);
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
          var loc = api + '/projects/' + project.id;
          res.setHeader('Location', loc);
          res.json(201, project);
        } else {
          res.json(500, err);
        }
	    });
	  });
	});
	
	/**
	 * Update project
	 * 
	 * TODO: check user access level
	 */
	app.put(api + '/projects/:id', function(req, res) {
	  Project.get(req.params.id, function(err, project) {
	    if (err) {
        res.json(500, err);	      
	    }
	    
	    if(grant(project.collaborator_ids, req.user.id)) {
        Project.update(req.params.id, {
          name: req.body.name,
          description: req.body.description,
          status: req.body.status
        }, function(err, result) {
          if (!err) {
            res.json(200, result);
          } else {
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
	 * TODO: check user access level 
	 */
	app.del(api + '/projects/:id', function(req, res) {
		Project.destroy(req.params.id, function(err) {
			if (!err) {
				res.json(200, {
				  status: 'ok',
				  msg: 'resource deleted successfully'
				});
			} else {
				res.json(500, err);
			}
		});
	});
	
	/**
	 * Add collaborator
	 * 
	 * TODO: check user access level 
	 */
	app.post(api + '/projects/collaborators', function(req, res) {
    Project.createCollaborator(req.body.id, {
      user_id: req.body.user_id,
      access: req.body.access      
    }, function(err, collaborator) {
      if (!err) {
        res.json(201, collaborator);
      } else {
        res.json(500, err);
      }  
    });
	});
};

module.exports = ProjectsRouter;