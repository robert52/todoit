// /**
 // * Set the environment to test
 // */
// process.env.NODE_ENV = 'test';
// 
// var resourceful = require('resourceful'),
    // root = __dirname + '/../../',
    // utils = require(root + 'lib/utils'),
    // colors = require('colors'),
    // chai = require('chai'),
    // expect = chai.expect,
    // should = chai.should(),
    // request = require('request'),
    // config = utils.loadConfig(),
    // api = '/api',
    // //app = require(root + 'app'),
    // db, URL, ENV;
// 
// ENV = process.env.NODE_ENV;
// 
// describe('User::Model'.yellow, function() {
  // var User, values = {
    // email : 'john.doe@todos.com',
    // password : 'john!2345'
  // };
// 
  // before(function(done) {
    // resourceful.use(config.storage.engine, {
      // database : config.storage.database
    // });
    // /**
     // * Get the database object
     // */
    // db = resourceful.connection.connection;
// 
    // User = require(root + 'app/models/user_model')(resourceful);
    // /**
     // * Clean database
     // */
    // utils.cleanDb(db, done);
// 
  // });
// 
  // after(function(done) {
    // utils.cleanDb(db, done);
  // });
// 
  // describe('#Create User'.cyan, function() {
// 
    // it('should have email and password required', function(done) {
      // var newUser = User.create({}, function(err, result) {
        // err.validate.errors.should.be.an('array');
        // err.validate.errors.length.should.equal(2);
        // err.validate.errors[0].property.should.equal('email');
        // err.validate.errors[1].property.should.equal('password');
        // done();
      // });
    // });
// 
    // it('should not create for an invalid email', function(done) {
      // var newUser = User.create({
        // email : 'john.doe@todos',
        // password : 'john!2345'
      // }, function(err, result) {
        // err.validate.errors[0].property.should.equal('email');
        // done();
      // });
    // });
// 
    // it('should not create for password length less then 8', function(done) {
      // var newUser = User.create({
        // email : 'john.doe@todos.com',
        // password : 'john!'
      // }, function(err, result) {
        // err.validate.errors[0].property.should.equal('password');
        // done();
      // });
    // });
// 
    // // it('should encrypt password', function(done) {
    // // var newUser = User.create({
    // // email: values.email,
    // // password: values.password
    // // }, function(err, result) {
    // // result.password.should.not.equal(values.password);
    // // done();
    // // });
    // // })
  // });
// 
  // describe('#Get User'.cyan, function(done) {
//     
    // it('should return user without password and salt when calling with safeJSON', function(done) {
      // User.hashPassword(values.password, function(err, password, salt) {
        // if (err) throw err;
//         
        // User.create({
          // 'email' : values.email,
          // 'password' : password,
          // 'password_salt' : salt
        // }, function(err, user) {
          // if (err)
            // throw err;
// 
          // user.safeJSON().should.not.include.keys('password', 'password_salt');
          // done();
        // });
      // });
    // });
  // });
// 
  // describe('#Check User credentials'.cyan, function() {
    // var newValues = {
      // email : 'jane.doe@evozon.com',
      // password : 'jane!2345'
    // };
// 
    // before(function(done) {
      // User.hashPassword(newValues.password, function(err, password, salt) {
        // if (err) throw err;
//         
        // User.create({
          // 'email' : newValues.email,
          // 'password' : password,
          // 'password_salt' : salt
        // }, function(err, user) {
          // if (err)
            // throw err;
// 
          // done();
        // });
      // });
    // });
// 
    // it('should find the user for valid credentials', function(done) {
      // User.checkCredentials(newValues.email, newValues.password, function(err, result) {
        // result.should.not.equal(null);
// 
        // done();
      // });
    // });
  // });
// });
