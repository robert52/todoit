function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');
}

var MainRouter;

MainRouter = function(app, config, passport) {
  /**
   * Authenticating user
   */
  app.post('/login', passport.authenticate('local', {
    successRedirect : '/dashboard',
    failureRedirect : '/'
  }));
  
  /**
   * Logout user 
   */
  app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
  });
  
  /**
   * Protect dashboard folder 
   */
  app.all('/dashboard/*', ensureAuthenticated, function(req, res, next) {
    next();
  });
  
  /**
   * Protect API  
   */
  app.all('/api/*', ensureAuthenticated, function(req, res, next) {
    next();
  });  
};

module.exports = MainRouter;
