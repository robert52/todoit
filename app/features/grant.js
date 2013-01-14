var underscore = require('underscore');

/**
 * Check if the entity is part of a list
 * 
 * @param {Array} collaborators list
 * @param {String|Number} user a user's id
 */

module.exports.hasAccess = function(collaborators, user) {
  var found = underscore.filter(collaborators, function(collaborator) {
    return collaborator.user_id === user;
  });
  
  return found.length !== 0;
};

function NoAccessError(msg) {
  Error.call(this);
  Error.captureStackTrace(this, arguments.callee);
  this.message = msg;
  this.name = 'NoAccessError';
}

NoAccessError.prototype.__proto__ = Error.prototype;

module.exports.NoAccessError = NoAccessError;
