module.exports = function(schema, Schema, app) {
  /**
   * Define user schema
   */
  var User = schema.define('User', {
    email: { type: String },
    password_salt: { type: String },
    password: { type: String }    
  });

  /**
   * Define person schema 
   */
  var Project = schema.define('Project', {
    name: { type: String },
    owner_id: { type: String },
    description: { type: Schema.Text },
    status: { type: String }    
  });

  /**
   * Define collaborator schema
   */
  var Collaborator = schema.define('Collaborator', {
    user_id: { type: String },
    access: { type: String }
  });

  /**
   * Define todo schema
   */
  var Todo = schema.define('Todo', {
    title: { type: String },
    assignee_id: { type: String },
    completed: { type: Boolean, default: false }
  });
  
  /**
   * Define relationships
   */
  Project.hasMany(Collaborator, {as: 'collaborators', foreignKey: 'project_id'});
  Project.hasMany(Todo, {as: 'todos', foreignKey: 'project_id'});
  Collaborator.belongsTo(Project, {as: 'project', foreignKey: 'project_id'});
  Todo.belongsTo(Project, {as: 'project', foreignKey: 'project_id'});
  
  /**
   * Attach schemas to app
   */
  if (app) {
    app.set('models', schema.models);
  }
  
  return schema;
};