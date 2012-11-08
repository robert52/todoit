/**
 * Set the environment to test 
 */
process.env.NODE_ENV = 'test';
/*
var resourceful = require('resourceful'),
    root = __dirname + '/../../',
    utils = require(root + 'lib/utils'),
    colors = require('colors'),
    chai = require('chai'),
    expect = chai.expect,
    should = chai.should(),
    request = require('request'),
    api = '/api',
    app = require(root + 'app'),
    config,
    URL,
    ENV;
    
config = app.config;  
ENV = process.env.NODE_ENV;
URL = utils.createBaseUrl(config.get('host'), config.get('port'), config.get('https'));


describe('Authentication::API'.blue, function() {
    
    before(function(done) {
        utils.cleanDb();
        done();
    });
    
    describe('#GET'.cyan + api + '/todos', function() {
        
        it('should get all todos', function(done) {
            request(URL + api + '/todos', function(err, res, body) {
                if (err) throw err;
                
                res.statusCode.should.equal(200);
                JSON.parse(body).should.be.an('array');
                done(); 
            });
        });
    });
    
    describe('#GET'.cyan + api + '/todos/:id', function() {
        
        it('should get a todo by id', function(done) {
            done(); 
        });
    });
});
*/