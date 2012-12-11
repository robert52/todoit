
var ProjectModel = function(resourceful) {

	var Project = resourceful.define('project');
	
	Project.parent('User');
	
	Project.string('name', {required: true});
	Project.string('description');
	Project.string('status');
  Project.array('collaborators');
	//Owner id is not needed relation to the user is defined
	//Project.string('owner', {required: true});
	
	Project.timestamps();
	
	return Project;
};

module.exports = ProjectModel;
