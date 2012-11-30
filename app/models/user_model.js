var crypto = require('crypto'),
    /**
     * Creates a salt
     *
     */
    makeSalt = function() {
      return Math.round((new Date().valueOf() * Math.random())) + 'super!2#4secret';
    },
    /**
     * Hashes a password string
     *
     * sha1 is used for hashing with a salt output will be in hexa
     *
     * @param {String} password
     * @param {String} salt
     * @return {String} hashed_password hex format
     */
    encryptPassword = function(password, salt) {
      return crypto.createHmac('sha1', salt).update(password).digest('hex');
    };
/**
 * User Model component
 *
 * Defines a resourceful resource of user type
 *
 * @param {Object} resourceful
 * @return {Object} User
 */
var UserModel = function(resourceful) {
  /**
   * Define the user model
   */
  var User = resourceful.define('user');

  User.string('email', {
    format : 'email',
    required : true,
    unique : true
  });
  User.string('password_salt', {
    restricted : true
  });
  User.string('password', {
    required : true,
    restricted : true,
    minLength : 7
  });

  /**
   * Hash the user's password
   *
   * @param {String} password
   * @param {String} salt
   * @param {Function} callback
   * @return {String} hashed-password
   */
  User.method('hashPassword', function(password, callback) {
    var salt = makeSalt();
    var hash = encryptPassword(password, salt);

    if (callback)
      callback(hash, salt);

    return hash;
  }, {
    properties : {
      'password' : {
        'type' : 'string',
        'required' : true
      }
    }
  });
  /**
   * Finds a user by it's email and password
   *
   * @param {String} email
   * @param {String} password
   * @param {Function} callback
   */
  User.method('checkCredentials', function(email, password, callback) {

    this.find({
      'email' : email
    }, function(err, result) {
      var user = null;
      
      if (!err) {
        err = null;
      }

      if (result.length !== 0) {
        user = result[0];
        
        if (user.password !== encryptPassword(password, user.password_salt)) {
          user = null;
        }        
      } 
      
      if (callback) callback(err, user);
    });
  }, {
    properties : {
      'email' : {
        'type' : 'string',
        'required' : true
      },
      'password' : {
        'type' : 'string',
        'required' : true
      }
    }
  });

  User.timestamps();

  return User;
};

module.exports = UserModel;
