var flatiron = require('flatiron'),
	resourceful = require('resourceful'),
	plates = require('plates'),
	path = require('path'),
	ecstatic = require('ecstatic'),
	restful = require('restful'),
	app = module.exports = flatiron.app,
	ENV = process.env.NODE_ENV || 'development',
	config;

/**
 * Config file 
 */
app.config.file({ file: path.join(__dirname, './config/environments/' + ENV + '.json')});

/**
 * Flatiron configs 
 */
app.use(flatiron.plugins.http, {
	before: [
		ecstatic(path.join(__dirname, './public'), {autoIndex: false, cache: "0, no-cache, no-store, must-revaliate"}) //cache control was turned off
	]
});

app.use(flatiron.plugins.resourceful, {
  engine: app.config.get('storage').engine,
  database: app.config.get('storage').database
});

/**
 * Registering models 
 */
// app.resources = {};
// app.resources.Todo = require('./app/models/todo');
['todo'].forEach(function(model) {
	app.resources[model] = require('./app/models/' + model + '_model')(resourceful);
});

/**
 * Registering routers 
 */
['main', 'todos'].forEach(function(router) {
	require('./app/routers/' + router + '_router')(app, resourceful, plates, config);
});

/**
 * Reflect RESTful routes from resourceful's resources
 */
//app.use(restful);

app.start(app.config.get('port') || 3000, function(err) {
	if (err) {
		throw err;
	}
	
	var addr = app.server.address();
	app.log.info('Environment: ' + ENV.cyan + ' Listening on http://' + addr.address + ':' + addr.port);
	//console.log(app.router.routes);
});
