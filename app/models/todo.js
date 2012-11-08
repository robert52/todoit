var restful = require('restful');
var resourceful = require('resourceful');
var http = require('http');

module.exports = resourceful.define('todo', function() {
	this.restful = true;
	this.string('title');
	this.bool('completed');
	this.number('order');
});
