var resourceful = require('resourceful'), 
    faker = require('./vendor/faker'), 
    colors = require('colors'), 
    log = console.log, 
    ENV = process.env.NODE_ENV || 'development', 
    db, 
    JK = {};

JK.abortIfProduction = function() {
  if (ENV === 'production') {
    throw new Error('Environment production cannot run clean database task');
  }
};

task('init', [], function() {
  JK.utils = JK.utils || require('./lib/utils');
  log(('- environment: ' + ENV).cyan);
  //load config only once
  if (!JK.config) {
    JK.config = JK.utils.loadConfig(ENV);
    complete();
  }
}, {
  async : true
});

namespace('db', function() {
  desc('Connect to database');
  task('connect', ['init'], function() {
    var me = this;

    log('- db:connect'.yellow);
    resourceful.use(JK.config.storage.engine, {
      database : JK.config.storage.database
    });
    db = resourceful.connection.connection;
  });

  desc('Load models');
  task('loadModels', [], function() {
    log('- db:loadModels'.yellow);
    if (!JK.Models) {
      JK.Models = {};

      ['todo'].forEach(function(model) {
        JK.Models[model] = require('./app/models/' + model + '_model')(resourceful);
      });
    }
    log(' loaded models'.green);
  })
  desc('Empty database')
  task('empty', ['connect'], function() {

    JK.utils.cleanDb(db, function() {
      log(' emptied database'.green);
      complete();
    });

  }, {
    async : true
  });

  desc('Populate db with fake data');
  task('populate', ['empty', 'loadModels'], function(count) {
    log('- db:populate'.yellow);

    var Todo = JK.Models.todo;
    count = count || 10; ( function populate(nr) {
        if (nr === 0) {
          log((' populated ' + ENV + ' database').green);
          process.exit(0);
        }

        var todo = new (Todo)({
          title : faker.Lorem.sentence(),
          order : faker.Helpers.randomNumber(100),
          completed : false
        });

        todo.save(function(err, result) {
          if (err)
            throw err;

          nr--;

          process.nextTick(function() {
            populate(nr);
          });
        });      }(count));
  });
});
