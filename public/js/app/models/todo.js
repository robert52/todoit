define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
	var Todo;
	
	Todo = Backbone.Model.extend({
		idAttribute: 'id',
        defaults: {
            title: '',
            completed: false
        },
        /**
         * Toggle the `completed` state of this todo item
         */
        toggle: function() {
            this.save({
                completed: !this.get('completed')
            });
        }
	});
	
	return Todo;
});
