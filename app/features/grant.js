var underscore = require('underscore');

module.exports = function(collaborators, user) {
  console.log(collaborators, user, underscore.contains(collaborators, user));
  return underscore.contains(collaborators, user);
};
