/**
 * get environment type 
 */
var ENV = process.env.NODE_ENV || 'development';

var path = require('path');
var express = require('express');
var http = require('http');
var jugglingdb = require('jugglingdb');
var Schema = jugglingdb.Schema;
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;  
var colors = require('colors');
var app = express();
var utils = require('./lib/utils');
var config = utils.loadConfig();
var EventEmitter = require('events').EventEmitter;
var AppEmitter = new EventEmitter();
var appStarter;
var server;

/**
 * Storage engine
 */
var schema = new Schema('nano', {port: 5984, url: 'http://localhost:5984/juggling_db'});

/**
 * Registering models
 */
['user', 'project', 'collaborator', 'todo'].forEach(function(model) {
  require('./app/models/' + model + '_model')(schema);
});

/**
 * Authentification system
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  schema.models.User.find(id, function(err, user) {
    done(err, user);     
  });
});

passport.use('local', new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    schema.models.User.checkCredentials(username, password, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false, {message: 'Unknown user ' + username}); }
      
      return done(null, user);
    });         
  });
}));

/**
 * Configure Express 
 */
app.configure(function() {
  //app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

/**
 * Registering routers
 */
['main', ,'projects', 'todos'].forEach(function(router) {
  require('./app/routers/' + router + '_router')(app, schema, config, passport);
});

/**
 * App starter function 
 */
appStarter = function() {
  server = http.createServer(app);
  server.listen(config.port || 3000);
  console.log(('App is running, listening on port: ' + server.address().port).green + ' Environment: ' + ENV.cyan);   
};

/**
 * Start the app if not loaded by another module
 */
if (!module.parent) {
 appStarter();
}

/**
 * App starter event
 */
AppEmitter.on('app-start', function() {
  appStarter();
  AppEmitter.emit('server-running', server, app);
});
/**
 * Expose the app service
 */
AppEmitter.on('app-check', function() {
  AppEmitter.emit('app-get', app);
});
/**
 * Expose server
 */
AppEmitter.on('server-check', function() {
  AppEmitter.emit('server-get', server);
});
/**
 * Export to use in external modules.
 * Can execute a callback after the app has loaded.
 */
module.exports = app;