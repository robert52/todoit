var CollaboratorModel = function(app) {
  var Collaborator = (app.models) ? app.models.Collaborator : app.get('models').Collaborator;
  
  // var Project = app.models.Project;
  // var Collaborator = schema.define('Collaborator', {
    // user_id: { type: String },
    // access: { type: String }
  // });

  

  return Collaborator;
};

module.exports = CollaboratorModel;
