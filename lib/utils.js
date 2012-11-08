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
    cleanDb: function(db, callback) {
        db.destroy(function() {
            db.create(function() {
                if (callback) callback();
            });
        });
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
