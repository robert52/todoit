define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/todos/todos'
], function($, _, Backbone, TodosView) {
	var DashboardView; 
	
	DashboardView = Backbone.View.extend({
		el: '#app',
		initialize: function() {
			this.todosView = new TodosView();
			this['page-content'] = this.$('.page-content');
		},
		render: function() {
			this['page-content'].html(this.todosView.$el);
			this.todosView.render();
			
			return this;
		}
	});
	
	return DashboardView;
});
