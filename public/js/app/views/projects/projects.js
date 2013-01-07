define([
  'jquery',
  'underscore',
  'backbone',
  'app/collections/projects',
  'app/views/projects/project',
  'text!app/templates/projects/index.html'
], function($, _, Backbone, ProjectsCollection, ProjectView, tpl) {
  var ProjectsView,
      Projects = new ProjectsCollection();
  
  ProjectsView = Backbone.View.extend({
    initialize: function() {
      this.template = _.template(tpl);
      
      Projects.fetch();
    },
    render: function() {
      this.$el.html(this.template());
      
      this.$projectsList = this.$('#projects-list');
      
      return this;
    },
    addOne: function(todo) {
      var view = new ProjectView({model: todo});
      this.$projectsList.append(view.render().el);
    },
    addAll: function() {
      this.$todoList.html('');
      Projects.each(this.addOne, this);
    }
  });
  
  return ProjectsView;
});
