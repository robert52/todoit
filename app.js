var flatiron = require('flatiron'), 
    resourceful = require('resourceful'), 
    path = require('path'), 
    ecstatic = require('ecstatic'), 
    passport = require('passport'), 
    fpassport = require('flatiron-passport'), 
    LocalStrategy = require('passport-local').Strategy, 
    app = module.exports = flatiron.app, 
    resources = {}, ENV = 
    process.env.NODE_ENV || 'development';

var protectPath = function(regex) {
  return function(req, res) {

  }
};

/**
 * Config file
 */
app.config.file({
  file : path.join(__dirname, './config/environments/' + ENV + '.json')
});

app.use(flatiron.plugins.resourceful, {
  engine : app.config.get('storage').engine,
  database : app.config.get('storage').database
});

/**
 * Registering models
 */
['user', 'todo'].forEach(function(model) {
  resources[model] = require('./app/models/' + model + '_model')(resourceful);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  resources.user.get(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local', new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    resources.user.checkCredentials(username, password, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, {
          message : 'Unknown user ' + username
        });
      }

      return done(null, user);
    });
  });
}));

/**
 * Flatiron configs
 */

app.use(flatiron.plugins.http, {
  before : [
  function(req, res) {
    req.originalUrl = req.url;

    if (!/^\/dashboard$|dashboard\/.*$/.test(req.url)) {
      return res.emit('next');
    }
    
    if (res.req.isAuthenticated()) {
      return res.emit('next');
    }
    
    res.redirect('/');  },
  ecstatic(path.join(__dirname, './public'), {
    autoIndex : false,
    cache : "0, no-cache, no-store, must-revaliate"
  }) //cache control was turned off
  ]
});

app.use(fpassport);

/**
 * Registering routers
 */
['main', 'todos'].forEach(function(router) {
  require('./app/routers/' + router + '_router')(app, resourceful, fpassport);
});

app.start(app.config.get('port') || 3000, function(err) {
  if (err) {
    throw err;
  }

  var addr = app.server.address();
  app.log.info('App is running in: ' + ENV.green + ' environment');
  app.log.info('Listening on ' + ('http://' + addr.address + ':' + addr.port).green);
}); 