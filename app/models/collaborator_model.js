var CollaboratorModel = function(schema) {
  var Project = schema.models.Project;
  var Collaborator = schema.define('Collaborator', {
    user_id: { type: String },
    access: { type: String }
  });

  Collaborator.belongsTo(Project, {as: 'project', foreignKey: 'project_id'});

  return Collaborator;
};

module.exports = CollaboratorModel;
