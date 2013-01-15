var crypto = require('crypto');
/**
 * Creates a salt
 * @return {String} salt
 */
var makeSalt = function() {
  return Math.round((new Date().valueOf() * Math.random())) + 'super!2#4secret';
};
/**
 * Hashes a password string
 *
 * sha1 is used for hashing with a salt output will be in hexa
 *
 * @param {String} password
 * @param {String} salt
 * @return {String} hashed_password hex format
 */
var encryptPassword = function(password, salt) {
  return crypto.createHmac('sha1', salt).update(password).digest('hex');
};
/**
 * User Model component
 *
 * Defines the user model
 *
 * @param {Object} schema object
 * @return {Object} User model
 */
var UserModel = function(schema) {
  /**
   * Define the user model
   */
  var User = schema.define('User', {
    email: { type: String },
    password_salt: { type: String },
    password: { type: String }    
  });

  /**
   * Hash the user's password
   *
   * @param {String} password
   * @param {String} salt
   * @param {Function} callback
   * @return {String} hashed-password
   */
  User.hashPassword = User.prototype.hashPassword = function(password, callback) {
    var salt = makeSalt();
    var hash = encryptPassword(password, salt);
    var err = null;
    
    if (callback) {
      callback(err, hash, salt);
    }

    return hash;
  };
  
  /**
   * Finds a user by it's email and password
   *
   * @param {String} email
   * @param {String} password
   * @param {Function} callback
   */
  User.checkCredentials = User.prototype.checkCredentials = function(email, password, callback) {
    this.findOne({where: {'email' : email}}, function(err, result) {
      var user = null;
      
      if (!err) {
        err = null;
      }

      if (result) {
        user = result;
        
        if (user.password !== encryptPassword(password, user.password_salt)) {
          user = null;
        }        
      } 
      
      if (callback) callback(err, user);
    });
  };

  /**
   * Model validation 
   */
  User.validatesPresenceOf('email', 'password', 'password_salt');
  User.validatesUniquenessOf('email', {message: 'email is not unique'});
  //validate the email's format
  User.validatesFormatOf('email', {'with': /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i});
  
  return User;
};

module.exports = UserModel;
