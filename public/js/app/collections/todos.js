define([
	'jquery',
	'underscore',
	'backbone',
	'app/models/todo'
],function($, _, Backbone, Todo) {
	var TodoCollection;
  
	TodoCollection = Backbone.Collection.extend({
		model: Todo,
		url: '../api/todos',
		idAttribute: 'id',
		nextOrder: function() {
            if (!this.length) {
                return 1;
            }
            
            return this.last().get('order') + 1;
        },
        comparator: function(todo) {
            return todo.get('order');
        }
	});
	
	return TodoCollection;
});
