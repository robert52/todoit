var ClientRouter = function(app, resourceful, plates, config) {
  var resources = resourceful.resources,
      Client = resourceful.resources.Client,
      api = app.config.get('api-url');

  /**
   * Get all clients
   */
  app.router.get(api + '/clients', function() {
    var me = this;

    Client.all(function(err, result) {
      me.res.json(200, result);
    });
  });

  /**
   * Get a client by id
   */
  app.router.get(api + '/client/:id', function(id) {
    var me = this;

    Client.get(id, function(err, result) {
      me.res.json(200, result);
    });
  });

  /**
   * Create new user
   */
  app.router.post(api + '/client/', function() {
    //some creation code here...
  });

  /**
   * Update user
   */
  app.router.put(api + '/client/:id', function(email, name, resource) {
    //some awsome stuff here
  });

  /**
   * Delete user
   */
  // app.router.del('/user/:id', function() {
  // //some delete function
  // });
};

module.exports = ClientRouter; 