define([
	'jquery',
	'underscore',
	'backbone',
	'app/collections/todos',
	'app/views/todos/todo',
	'text!app/templates/todos/index.html'
], function($, _, Backbone, TodosCollection, TodoView, tpl) {
	var TodosView,
		Todos = new TodosCollection();
		ENTER_KEY = 13,
		ESC_KEY =  27;
	
	TodosView = Backbone.View.extend({
		className: 'span5 container todos-view',
		events: {
			'keypress #new-todo': 'createOnEnter'
		},
		initialize: function() {
			this.template = _.template(tpl);
			
			console.log(Todos);
			
			Todos.on('add', this.addOne, this);
			Todos.on('reset', this.addAll, this);
			
			Todos.fetch();
		},
		render: function() {
			this.$el.html(this.template());
			
			this.$input = this.$('#new-todo');
			this.$todoList = this.$('#todo-list');
			
			return this;
		},
		newAttributes: function() {
            return {
                title: this.$input.val().trim(),
                order: Todos.nextOrder(),
                completed: false
            };
        },
		addOne: function(todo) {
            var view = new TodoView({model: todo});
            this.$todoList.append(view.render().el);
        },
        addAll: function() {
            this.$todoList.html('');
            Todos.each(this.addOne, this);
        },
		createOnEnter: function(event) {
            if (event.which !== ENTER_KEY || !this.$input.val().trim()) {
                return;
            }
            
            Todos.create(this.newAttributes(), {wait: true});
            this.$input.val('');
        }
	});
	
	return TodosView;
});
