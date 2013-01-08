var underscore = require('underscore');

/**
 * Check if the entity is part of a list
 * 
 * @param {Array} collaborators list
 * @param {String|Number} user a user's id
 */

module.exports = function(collaborators, user) {
  var found = underscore.filter(collaborators, function(collaborator) {
    return collaborator.user_id === user;
  });
  
  return found.length !== 0;
};
