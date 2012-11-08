var MainRouter;

MainRouter = function(app, resourceful, plates, config) {
	/**
	 * Sending response as json example 
	 */
	app.router.get('/json', function() {
		var myobj = {
			name : "Bob",
			age : 33
		};
		//this.res.writeHead(200, {'Content-Type': 'application/json'});
		this.res.json(200, myobj);
	});
};

module.exports = MainRouter;