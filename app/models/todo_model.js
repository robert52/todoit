var TodoModel = function(app) {
  var Todo = (app.models) ? app.models.Todo : app.get('models').Todo;
  
  Todo.validatesPresenceOf('title');
  
  return Todo;
};

module.exports = TodoModel;
