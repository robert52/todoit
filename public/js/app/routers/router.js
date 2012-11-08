define([
	'jquery',
	'underscore',
	'backbone',
	'app/views/dashboard'
], function($, _, Backbone, DashboardView) {
	var AppRouter;
	
	AppRouter = Backbone.Router.extend({
		routes: {
			'': 'dashboard',			    //	#
			'dashboard': 'dashboard',		// 	#home
			'*actions': 'defaultAction'		//	#anything
		},
		initialize: function() {
			this.$elms = {
				'header' : $('#header'),
				'page-content' : $('.page-content'),
				'footer': $('#footer')
			};
		},
		dashboard: function() {
			if (!this.dashboardView) {
				this.dashboardView = new DashboardView();
			}
			
			this.dashboardView.render();
		},
		defaultAction: function() {
			//some default stuff here
		}
	});
	
	return AppRouter;
});
