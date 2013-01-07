define([
  'jquery',
  'underscore',
  'backbone',
  'text!app/templates/projects/project.html'
], function($, _, Backbone, tpl) {
  
  var ProjectView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
      this.template = _.template(tpl);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      return this;      
    }    
  });
  
  return ProjectView;
});