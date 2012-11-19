
var TodoModel = function(resourceful) {

	var Todo = resourceful.define('todo', function() {

		this.string('title', {required: true});
		this.bool('completed', {required: true});
		this.number('order', {required: true});
		
		this.timestamps();
	});
	
	return Todo;
};

module.exports = TodoModel;
