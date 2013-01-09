var CollaboratorModel = function(resourceful) {

  var Collaborator = resourceful.define('collaborator');

  Collaborator.parent('Project');
  
  Collaborator.string('user_id', {required: true});
  Collaborator.string('access');

  Collaborator.timestamps();

  return Collaborator;
};

module.exports = CollaboratorModel;
