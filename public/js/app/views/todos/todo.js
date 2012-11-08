define([
	'jquery',
	'underscore',
	'backbone',
	'text!app/templates/todos/todo.html'
], function($, _, Backbone, tpl) {
	var TodoView,
		ENTER_KEY = 13,
		ESC_KEY =  27;
	
	TodoView = Backbone.View.extend({
		tagName: 'li',
		events: {
			'click .toggle': 'toggleCompleted',
            'dblclick .todo-text':	'edit',
            'click .destroy': 'clear',
            'keypress .edit': 'updateOnEnter',
            'blur .edit': 'close',
            'keyup .edit': 'closeOnEsc'
		},
		initialize: function() {
			this.template = _.template(tpl);
			
			this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
		},
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			
			this.$input = this.$('#new-todo');
			this.$el.toggleClass('completed', this.model.get('completed'));
            this.$input = this.$('.edit');
			
			return this;
		},
		toggleCompleted: function() {
            this.model.toggle();
            
            return false;
        },
        edit: function() {
            this.$el.addClass('editing');
            this.lastValue = this.$input.val().trim();
            this.$input.focus();
        },
        clear: function() {
            this.model.destroy({wait: true});
            
            return false;
        },
        close: function() {
            this.$el.removeClass('editing');
        },
        updateOnEnter: function(event) {
            if (event.which === ENTER_KEY) {
	            var value = this.$input.val().trim();
            
	            if (value) {
	            	if (value !== this.lastValue) {
	                	this.model.save({title: value}, {wait: true});
					}
	            } else {
	                this.clear();
	            }
	            
                this.close();
            }
        },
        closeOnEsc: function(event) {
            if (event.which == ESC_KEY) {
                this.$input.val(this.lastValue);
            }
        }
	});
	
	return TodoView;
});
