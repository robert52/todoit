require.config({
	urlArgs: "bust=" +  (new Date()).getTime(),
	paths: {
		'App' : 'app',
		'jquery' : 'vendors/jquery/jquery',
		'backbone' : 'vendors/backbone/backbone',
		'bootstrap' : 'vendors/bootstrap/bootstrap',
		'underscore': 'vendors/underscore/underscore',
		'm' : 'vendors/ace-subido-metro/m-all'
	},
	shim: {
		'underscore' : {
			exports : '_'
		},
		'backbone' : {
			deps : ['jquery', 'underscore'],
			exports : 'Backbone'
		},
		'bootstrap' : {
			deps : ['jquery'],
			exports : 'bootstrap'
		},
		'm' : {
			deps : ['jquery'],
			exports : 'm'
		}
	}	
});

require([
	'jquery',
	'underscore',
	'backbone',
	'bootstrap',
	'm',
	'App'
], function($, _, Backbone, bootstrap, m, App) {
	App.init();
});
