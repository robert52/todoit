var TodoModel = function(schema) {
  var Project = app.get('models').Project;
  var Todo = schema.define('Todo', {
    title : { 
      type: String
    },
    completed : {
      type: Boolean,
      default: false
    },
    description: {
      type: String
    },
    assignee_id: {
      type: String
    }
  });

  Todo.belongsTo(Project, {
    as: 'project',
    foreignKey: 'project_id'
  });

  return Todo;
};

module.exports = TodoModel;
