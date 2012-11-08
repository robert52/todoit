define('App', [
	'jquery',
	'underscore',
	'backbone',
	'app/routers/router',
	'bootstrap'
], function($, _, Backbone, Router) {
	var App = {};
	App.init = function() {
		console.log('app started');
		this.router = new Router();
		
		Backbone.history.start();
	};
	
	return App;
});
