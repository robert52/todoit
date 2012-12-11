var ProjectsRouter = function(app, resourceful, config, passport) {
	var resources = resourceful.resources,
    User = resources.User,
		Project = resources.Project,
		api = config['api-url'];

	/**
	 * Get all user's projects
	 */
	app.get(api + '/projects', function(req, res) {
	  User.projects(req.user.id, function(err, result) {
	    if (!err) {
	      res.json(200, result);
	    } else {
       throw err;
        
        res.json(500, err);
	    }
	  });
	});
	
	/**
	 * Get a user's project by id 
	 */
	app.get(api + '/projects/:id', function(req, res) {
    Project.get('user/' + req.user.id + '/' + req.params.id, function(err, result) {
      
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
	  User.createProject(req.user.id, {
	    name: req.body.name,
	    description: req.body.description,
	    status: req.body.status || 'active',
	    collaborators: req.body.collaborators || []
	  }, function(err, result) {
	    
	    if (!err) {
	      var loc = api + '/projects/' + result.id;
	      res.setHeader('Location', loc);
	      res.json(201, result);
	    } else {
	      res.json(500, err);
	    }
	  });
	});
	
	/**
	 * Update user 
	 */
	app.put(api + '/projects/:id', function(req, res) {
		Project.update(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      collaborators: req.body.collaborators
		}, function(err, result) {
		  
			if (!err) {
				res.json(204)
			} else {
				res.json(500, err);
			}
		});
	});
	
	/**
	 * Delete user 
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
};

module.exports = ProjectsRouter;