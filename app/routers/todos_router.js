var TodosRouter = function(app, config, passport) {
  var models = app.get('models');
  var User = models.User;
  var Project = models.Project;
  var Collaborator = models.Collaborator
  var Todo = models.Todo;
  var api = config['api-url'];
  var async = require('async');
  var grant = require('../features/grant');
  var hasAccess = grant.hasAccess;
  var NoAccessError = grant.NoAccessError;
  /**
   * Get all todo for a project
   */
  app.get(api + '/todos/project/:id', function(req, res, next) {
    async.series({
      check_access: function(callback) {
        Collaborator.all({where: {'project_id' : req.params.id} }, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }

          callback(err, 'done');
        });
      },
      get_todos: function(callback) {
        Todo.all({ where: { project_id: req.params.id} }, function(err, todos) {
          callback(err, todos);
        });
      }
    }, function(err, results) {
      if (!err) {
        res.json(200, results.get_todos);
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
  app.get(api + '/todos/:id', function(req, res, next) {
    async.auto({
      get_todo: function(callback) {
        Todo.find(req.params.id, function(err, todo) {
          callback(err, todo);
        });
      },
      check_access: ['get_todo', function(callback, results) {
        Collaborator.all({where: {'project_id' : results.get_todo.project_id} }, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }

          callback(err, 'done');
        });       
      }]
    },function(err, results) {
      if (!err) {
        res.json(200, results.get_todo);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }      
    });
  });

  /**
   * Add a new todo to a project
   */
  app.post(api + '/todos/project/:id', function(req, res) {
    async.auto({
      check_access: function(callback) {
        Collaborator.all({where: {'project_id' : req.params.id} }, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }

          callback(err, 'done');
        });
      },
      get_project: ['check_access', function(callback, results) {
        Project.find(req.body.id, function(err, project) {
          callback(err, project);
        });
      }],
      add_todo: ['get_project', function(callback, results) {
        results.get_project.todos.create({
          title: req.body.title
        }, function(err, todo) {
          callback(err, todo);
        });
      }] 
    }, function(err, results) {
      if (!err) {
        res.json(201, results.add_todo);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }     
    });
  });

  /**
   * Update a todo
   */
  app.put(api + '/todos/:id', function(req, res) {
    async.auto({
      get_todo: function(callback) {
        Todo.find(req.params.id, function(err, todo) {
          callback(err, todo);
        });
      },           
      check_access: ['get_todo', function(callback, results) {
        Collaborator.all({where: {'project_id' : results.get_todo.project_id} }, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }

          callback(err, 'done');
        });
      }],
      update_todo: ['check_access', function(callback, results) {
        results.get_todo.updateAttributes({
          title: req.body.title,
          completed: req.body.completed,
          assignee_id: req.body.assignee_id
        }, function(err, todo) {
          callback(err, todo);
        });
      }] 
    }, function(err, results) {
      if (!err) {
        res.json(200, results.update_todo);
      } else if (err && err.name === 'NoAccessError') {
        res.json(401, {msg: 'You do not have access.'});
      } else {
        res.json(500, {msg: 'Something went wrong.'});
      }     
    });
  });

  /**
   * Delete user
   */
  app.del(api + '/todos/:id', function(req, res) {
    async.auto({
      get_todo: function(callback) {
        Todo.find(req.params.id, function(err, todo) {
          callback(err, todo);
        });
      },           
      check_access: ['get_todo', function(callback, results) {
        Collaborator.all({where: {'project_id' : results.get_todo.project_id} }, function(err, collaborators) {
          if (!err && !hasAccess(collaborators, req.user.id)) {
            err = new NoAccessError('No Access!');
          }

          callback(err, 'done');
        });
      }],
      destroy_todo: ['check_access', function(callback, results) {
        results.get_todo.destroy(function(err) {
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
  });
};

module.exports = TodosRouter; 