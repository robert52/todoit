var TodosRouter = function(app, resourceful) {
	var resources = resourceful.resources,
		Todo = resources.Todo,
		api = app.config.get('api-url');

	/**
	 * Get all clients
	 */
	app.router.get(api + '/todos', function() {
		var me = this;

		Todo.all(function(err, result) {
			me.res.json(200, result);
		});
	});
	
	/**
	 * Get a client by id 
	 */
	app.router.get(api + '/todos/:id', function(id) {
		var me = this;

		Todo.get(id, function(err, result) {
			me.res.json(200, result);
		});
	});
	
	/**
	 * Create new user 
	 */
	app.router.post(api + '/todos/', function() {
		var me = this;
		
		var todo = new(Todo)({
			title: me.req.body.title,
			order: me.req.body.order,
			completed: me.req.body.completed
		});
		
		todo.save(function(err, t) {
			if (!err) {
				var loc = api + '/todos/' + t.id;
				me.res.setHeader('Location', loc);
				me.res.json(201, t);
			} else {
				me.res.json(500, err);
			}
		});
	});
	
	/**
	 * Update user 
	 */
	app.router.put(api + '/todos/:id', function(id) {
		var me = this;
		
		Todo.update(id, {
			title: me.req.body.title,
			order: me.req.body.order,
			completed: me.req.body.completed
		}, function(err, result) {
			if (!err) {
				me.res.json(204)
				//console.log(result);
			} else {
				me.res.json(500, err);
				//console.log(err);
			}
		});
	});
	
	/**
	 * Delete user 
	 */
	app.router.delete(api + '/todos/:id', function(id) {
		var me = this;
		
		Todo.destroy(id, function(err) {
			if (!err) {
				me.res.json(204);
			} else {
				me.res.json(500, err);
			}
		});
	});		
};

module.exports = TodosRouter;