var UserRouter = function(app, resourceful, plates, config) {
  var resources = resourceful.resources,
      api = app.config.get('api-url');

  /**
   * Getting all users from the database
   */
  app.router.get(api + '/users', function() {
    //this.res.writeHead(200, {'Content-Type': 'application/json'});
    var me = this;
    resources.User.all(function(err, result) {
      me.res.json(200, result);
    });
  });

  /**
   * Get a user by id
   */
  app.router.get(api + '/user/:id', function(id) {
    var me = this;
    console.log(id);
    resources.User.get(id, function(err, result) {
      me.res.json(200, result);
    });
  });

  /**
   * Create new user
   */
  app.router.post(api + '/user/', function() {
    //some creation code here...
  });

  /**
   * Update user
   */
  app.router.put(api + '/user/:id', function(email, name, resource) {
    //some awsome stuff here
  });

  /**
   * Delete user
   */
  // app.router.del('/user/:id', function() {
  // //some delete function
  // });
};

module.exports = UserRouter; 