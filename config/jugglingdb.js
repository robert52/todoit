module.exports.init = function(app) {
  var conf = require('./database.json')[app.get('env')];
  var jugglingdb = require('jugglingdb');
  var Schema = jugglingdb.Schema;
  var schema = new Schema(conf.driver, {url: conf.url});

  require('../db/schema')(schema, Schema, app);
};
