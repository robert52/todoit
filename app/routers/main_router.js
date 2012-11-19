var MainRouter = function(app, resourceful, fpassport) {
  var User = resourceful.resources.User,
      api = app.config.get('api-url');
  
  app.router.post('/login', fpassport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/'
  }));
  
  app.router.get('/users', function() {
    var me = this;
    
    User.all(function(err, result) {
        me.res.json(200, result);
    });
  });
  
  app.router.get('/logout', function() {
    this.req.logout();
    this.res.redirect('/');
  });
    
    // app.router.get('/login', function() {
        // var me = this;
//         
        // me.res.json(200, {status: 'error', msg: 'login failed'});
    // });

    // app.router.get('/dashboard', function() {
        // var me = this;
//         
        // me.res.json(200, {status: 'ok', msg: 'login success'});
    // });        
};


module.exports = MainRouter;