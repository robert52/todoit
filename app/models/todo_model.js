
var TodoModel = function(resourceful) {

	var Todo = resourceful.define('todo', function() {
		//this.restful = true;
		
		this.string('title', {required: true});
		this.bool('completed', {required: true});
		this.number('order', {required: true});
		this.string('description');
		this.string('reported_id');
		this.string('assignee_id');
		
		this.timestamps();
	});
	
	return Todo;
};

module.exports = TodoModel;
