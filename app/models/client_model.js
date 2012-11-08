
var ClientModel = function(resourceful) {
	
	var Client = resourceful.define('client', function() {
		this.string('name');
		this.string('company');
		this.string('email', {format: 'email'});
	});
	
	return Client;
};

module.exports = ClientModel;