var fs = require('fs'),
    path = require('path'),
    //cradle = require('cradle'),
    ENV = process.env.NODE_ENV || 'development',
    root = path.join(__dirname, '..'),
    utils;
    
utils = {
    loadConfig: function(env) {
        var e = (env) ? env : ENV;
        
        return JSON.parse(fs.readFileSync(path.join(root, 'config', 'environments', e + '.json'), 'utf8'));
    },
    /**
     * Creates a base url
     * 
     * @param {String} host
     * @param {Number|String} port
     * @param {Boolean} https
     * @return {String} url
     */
    createBaseUrl: function(host, port, https) {
        https = (https) ? 'https://' : 'http://';
        
        return https + host + ':' + port;
    },
    /**
     * Database cleaner function
     * 
     * Can accept a single model object (Function),
     * a list of objects (Array) or
     * schema models (Object)
     * 
     * @param {Function|Array|Object} model
     * @param {Function} callback
     */
    cleanDb: function(model, callback) {
      if (!callback) {
        callback = function() {};
      }
      
      if (model instanceof Array) {
        model.forEach(function(m) {
          m.destroyAll(function(err) {
            if (err) throw err;
          });
        });
        
        model.length === 0 || callback();
      } else if (model instanceof Object) { 
        for(var prop in model) {
          if (model.hasOwnProperty(prop)) {
            model[prop].destroyAll(function(err) {
              if (err) throw err;
            })
          }
        }
        
        callback();
      } else {
        model.destroyAll(function(err) {
          if (err) throw err;
          
          callback();
        });        
      }
    },
    prepareDb: function(db, data, callback) {
        cleanDb(db, function() {
            db.save(data, function(err, result) {
               if (err) throw err;
               
               if (callback) callback(err, result); 
            });
        });
    }
};


module.exports = utils;
