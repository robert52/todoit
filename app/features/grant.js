var underscore = require('underscore');

module.exports = function(collaborators, user) {
  return _.contains(collaborators, user);
};
