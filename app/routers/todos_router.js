var TodosRouter = function(app, resourceful, config, passport) {
	var resources = resourceful.resources,
		Todo = resources.Todo,
		api = config['api-url'];

	/**
	 * Get all clients
	 */
	app.get(api + '/todos', function(req, res) {
		Todo.all(function(err, result) {
			res.json(200, result);
		});
	});
	
	/**
	 * Get a client by id 
	 */
	app.get(api + '/todos/:id', function(req, res) {
		Todo.get(req.params.id, function(err, result) {
			res.json(200, result);
		});
	});
	
	/**
	 * Create new user 
	 */
	app.post(api + '/todos/', function(req, res) {
		var todo = new(Todo)({
			title: req.body.title,
			order: req.body.order,
			completed: req.body.completed
		});
		
		todo.save(function(err, t) {
			if (!err) {
				var loc = api + '/todos/' + t.id;
				res.setHeader('Location', loc);
				res.json(201, t);
			} else {
				res.json(500, err);
			}
		});
	});
	
	/**
	 * Update user 
	 */
	app.put(api + '/todos/:id', function(req, res) {
		Todo.update(req.params.id, {
			title: req.body.title,
			order: req.body.order,
			completed: req.body.completed
		}, function(err, result) {
			if (!err) {
				res.json(204)
				//console.log(result);
			} else {
				res.json(500, err);
				//console.log(err);
			}
		});
	});
	
	/**
	 * Delete user 
	 */
	app.del(api + '/todos/:id', function(req, res) {
		Todo.destroy(req.params.id, function(err) {
			if (!err) {
				res.json(204);
			} else {
				res.json(500, err);
			}
		});
	});		
};

module.exports = TodosRouter;