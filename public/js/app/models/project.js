define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
  var Project;

  Project = Backbone.Model.extend({
    idAttribute : 'id',
    defaults : {
      name : 'New project',
      description: '',
      status: 'active',
      collaborators: []
    }
  });

  return Project;
});
