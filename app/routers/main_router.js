var MainRouter;

MainRouter = function(app, resourceful, plates, fpassport) {
  app.router.get('/dashboard', function() {

  });
  /**
   * Authenticating user
   */
  app.router.post('/login', fpassport.authenticate('loal', {
    successRedirect : '/dashboard',
    failureRedirect : '/login.html'
  }));
};

module.exports = MainRouter;
