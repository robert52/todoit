var ProjectModel = function(app) {
  var Project = (app.models) ? app.models.Project : app.get('models').Project;
  // var Project = schema.define('Project', {
    // name: { type: String },
    // owner_id: { type: String },
    // description: { type: String },
    // status: { type: String }    
  // });
  
  return Project;
};

module.exports = ProjectModel;
