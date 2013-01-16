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
    JK.db = {};
    JK.db.conf = JK.db.conf || require('./config/database.json')[ENV];
    var jugglingdb = require('jugglingdb');
    var Schema = jugglingdb.Schema;
    var schema = new Schema(JK.db.conf.driver, {url: JK.db.conf.url});
    JK.schema = JK.schema || require('./db/schema')(schema, Schema);
    
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

      ['user', 'project', 'collaborator'].forEach(function(model) {
        JK.Models[model] = require('./app/models/' + model + '_model')(JK.schema);
      });
    }
    log(' loaded models'.green);
  })
  
  desc('Empty database')
  task('empty', ['connect', 'loadModels'], function() {
    var models = JK.schema.models;

    JK.utils.cleanDb(models, function() {
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
  
  desc('Add test users')
  task('populate-users', ['connect', 'loadModels'], function() {
    log('- db:populate-users'.yellow);
    var User = JK.Models.user;
    
    User.hashPassword('pass123', function(err, password, salt) {
      if (err) throw err;
      
      User.create({
        email: 'test@todoit.com',
        password: password,
        password_salt: salt
      }, function(err, user) {
        if (err) throw err;
      });
      
      User.create({
        email: 'bob@todoit.com',
        password: password,
        password_salt: salt
      }, function(err, user) {
        if (err) throw err;
        
        log((' populated with test users ' + ENV + ' database').green);
        complete();
      })
    });
  }, {
    async : true
  });
  
  desc('Add projects')
  task('populate-projects', ['connect', 'loadModels'], function(count) {
    log('- db:populate-projects'.yellow);
    
    var User = JK.Models.user,
        Project = JK.Models.project,
        Collaborator = JK.Models.collaborator,
        userId = null;

    count = count || 5;
    log(count);
    var populate = function(nr) {
      if (nr === 0) {
        log((' populated with projects ' + ENV + ' database').green);
        process.exit(0);
      }

      Project.create({
        owner_id: userId,
        name: faker.Company.companyName(),
        description: faker.Lorem.sentence(),
        status: faker.Helpers.randomize(['active', 'inactive'])
      }, function(err, project) {
        if (err) throw err;
        
        project.collaborators.create({
          user_id: userId,
          access: 'owner'          
        }, function(err, collaborator) {
          if (err) throw err;
          
          nr--;
          populate(nr);          
        });
        // Collaborator.create({
          // project_id: project.id,
          // user_id: userId,
          // access: 'owner'
        // }, function(err, collaborator) {
          // if (err) throw err;
//           
          // nr--;
          // populate(nr);
        // });
      });
    };

    User.findOne({ where : {'email': 'test@todoit.com'} }, function(err, result) {
      userId = result.id;
      if (!err) populate(count);
    });
    
  });
  
  desc('Add todos')
  task('populate-todos', ['connect', 'loadModels'], function(count) {
    var User = JK.Models.user,
        Project = JK.Models.project,
        projectId = null;

    count = count || 5;

    var populate = function(nr) {
      if (nr === 0) {
        log((' populated with projects' + ENV + ' database').green);
        process.exit(0);
      }
  
      Project.createTodo(projectId, {
        title : faker.Lorem.sentence(),
        order : faker.Helpers.randomNumber(10),
        completed : faker.Helpers.randomize([false, true])
      }, function(err, result) {
        if (err)
          throw err;
        
        nr--;
  
        process.nextTick(function() {
          populate(nr);
        });
      });    
    };

    User.find({'email': 'test@todoit.com'}, function(err, result) {
      if (!err) {
        User.createProject(result[0].id, {
          name: faker.Company.companyName(),
          description: faker.Lorem.sentence(),
          status: faker.Helpers.randomize(['active', 'inactive']),
          collaborators: []
        }, function(err, project) {
          if (err)
            throw err;
            
            projectId = project.id;
            
            populate(count);
            
        });
      }        
    });
  });  
  
});
