var TodosRouter = function(app, resourceful, config) {
  var resources = resourceful.resources;
  var User = resources.User;
  var Project = resources.Project;
  var Todo = resources.Todo;
  var api = config['api-url'];
  var async = require('async');
  var grant = require('../features/grant');
  var hasAccess = grant.hasAccess;
  var NoAccessError = grant.NoAccessError;
  var checkAccess = function(projectId) {
    
  };
  /**
   * Get all todo for a project
   */
  app.get(api + '/todos/project/:id', function(req, res, next) {
    async.series({
      check_access: function(callback) {
        Project.collaborators(req.params.id, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }
          
          callback(err, 'done');
        });
      },
      get_todos: function(callback) {
        Project.todos(req.params.id, function(err, todos) {
          callback(err, todos);
        });
      }
    }, function(err, result) {
      if (!err) {
        res.json(200, result.get_todos);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }
    });
  });

  /**
   * Get todo by id
   */
  app.get(api + '/todos/:id', function(req, res) {
    async.auto({
      get_todo: function(callback) {
        Todo.get(req.params.id, function(err, todo) {
          callback(err, todo);
        });
      },
      check_access: ['get_todo', function(callback, results) {
        Project.collaborators(results.get_todo.project_id, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }
          
          callback(err, collaborators);
        });        
      }]
    },function(err, results) {
      console.log(results);
      if (!err) {
        res.json(200, results.get_todo);
      } else if (err & err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }      
    });
  });

  /**
   * Create new user
   */
  app.post(api + '/todos/', function(req, res) {
    var todo = new (Todo)({
      title : req.body.title,
      order : req.body.order,
      completed : req.body.completed
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
      title : req.body.title,
      order : req.body.order,
      completed : req.body.completed
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