var underscore = require('underscore');

module.exports = function(collaborators, user) {
  return underscore.contains(collaborators, user);
};
