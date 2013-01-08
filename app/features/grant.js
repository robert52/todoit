var underscore = require('underscore');

/**
 * Check if the entity is part of a list
 * 
 * @param {Array} collaborators list
 * @param {String|Number} user a user's id
 */

module.exports = function(collaborators, user) {
  console.log(collaborators, user, underscore.contains(collaborators, user));
  return underscore.contains(collaborators, user);
};
