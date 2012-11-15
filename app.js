var flatiron = require('flatiron'), 
  resourceful = require('resourceful'), 
  path = require('path'), 
  ecstatic = require('ecstatic'), 
  passport = require('passport'), 
  fpassport = require('flatiron-passport'),
  LocalStrategy = require('passport-local').Strategy,  
  app = module.exports = flatiron.app, 
  ENV = process.env.NODE_ENV || 'development', 
  resources = {};

/**
 * Config file
 */
app.config.file({
  file : path.join(__dirname, './config/environments/' + ENV + '.json')
});

/**
 * Storage engine
 */
app.use(flatiron.plugins.resourceful, {
  engine : app.config.get('storage').engine,
  database : app.config.get('storage').database
});

/**
 * Registering models
 */
['todo', 'user'].forEach(function(model) {
  resources[model] = require('./app/models/' + model + '_model')(resourceful);
});

/**
 * Authentification system
 */
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  resources.user.get(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy(function(username, password, done) {
  resources.user.checkCredentials(username, password, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      return done(null, false, {
        message : 'Unknow user' + username
      });
    }

    return done(null, user);
  });
}));

/**
 * Flatiron configs
 */
app.use(flatiron.plugins.http, {
  before : [
  function(req, res) {
    if (req.originalUrl === undefined) {
      req.originalUrl = req.url;
    }
    res.emit('next');
  }, 
  ecstatic(path.join(__dirname, './public'), {
    autoIndex : false,
    cache : "0, no-cache, no-store, must-revaliate" //cache control was turned off
  }) 
  ]
});

app.use(fpassport);

/**
 * Registering routers
 */
['todos'].forEach(function(router) {
  require('./app/routers/' + router + '_router')(app, resourceful, fpassport);
});

/**
 * Start the app
 */
app.start(app.config.get('port') || 3000, function(err) {
  if (err) {
    throw err;
  }

  var addr = app.server.address();
  app.log.info('Environment: ' + ENV.cyan + ' Listening on http://' + addr.address + ':' + addr.port);
  //console.log(app.router.routes);
});
