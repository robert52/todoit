var ProjectsRouter = function(app, resourceful, config, passport) {
	var resources = resourceful.resources,
      User = resources.User,
  		Project = resources.Project,
  		api = config['api-url'];

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
    Project.get(req.params.id, function(err, result) {
      if (!err) {
        res.json(200, result);
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
	 */
	app.put(api + '/projects/:id', function(req, res) {
		Project.update(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status
		}, function(err, result) {
		  
			if (!err) {
				res.json(204)
			} else {
				res.json(500, err);
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
				res.json(204);
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
          res.json(204);
        } else {
          res.json(500, err);
        }        
    });
	});
};

module.exports = ProjectsRouter;