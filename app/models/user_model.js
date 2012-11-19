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
hashPassword = function(password, salt) {
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
  User.string('password', {
    required : true,
    restricted : true
  });
  User.string('password_salt', {
    restricted : true
  });

  User.method('hashPassword', function(password, callback) {
    var salt = makeSalt();
    var hashedPassword = hashPassword(password, salt);

    if (callback)
      callback(hashedPassword, salt);

    return hashedPassword;
  }, {
    properties : {
      'password' : {
        'type' : 'string',
        required : true
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
    var me = this;

    this.find({
      email : email
    }, function(err, result) {
      if (result.length !== 0) {
        var user = result[0];

        var hashedPassword = hashPassword(password, user.password_salt);

        if (result[0].password !== hashedPassword)
          user = null;

        if (callback)
          callback(null, user);
      } else {

        if (callback)
          callback(err, null);
      }

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
