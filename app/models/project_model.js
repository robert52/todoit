var ProjectModel = function(resourceful) {

  var Project = resourceful.define('project');

  Project.string('name', {
    required : true
  });
  Project.string('owner_id', {
    required : true
  });
  Project.string('description');
  Project.string('status');

  Project.timestamps();

  return Project;
};

module.exports = ProjectModel;
