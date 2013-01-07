define([
  'jquery',
  'underscore',
  'backbone',
  'app/models/project'
],function($, _, Backbone, Project) {
  var TodoCollection;
  
  ProjectCollection = Backbone.Collection.extend({
    model: Project,
    url: '../api/projects',
    idAttribute: 'id'
  });
  
  return ProjectCollection;
});
