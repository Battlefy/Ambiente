
// modules
var path = require('path');

// lib
var Config = require('../lib/config');

// constants
var TEST_CONFIG_PATH = path.resolve(
  __dirname,
  'fixtures/app/test.json'
);


describe('config', function() {

  it('accepts a path', function() {
    new Config(TEST_CONFIG_PATH);
  });

  it('accepts a path and callback it calls when ready', function(done) {
    var config = new Config(TEST_CONFIG_PATH, function(err, _config) {
      if(err) { throw err; }
      config.should.eql(_config);
      done();
    });
  });

  it('emits an event for root each key in the config', function(done) {

    var _config = require(TEST_CONFIG_PATH);

    var config = new Config(TEST_CONFIG_PATH);
    
    config.on('a', function(a) {
      a.should.eql(_config.a);
      done();
    });

  });

  it('applies all of the config data to itself upon a ready event', function() {

    var _config = require(TEST_CONFIG_PATH);
    var config = new Config(TEST_CONFIG_PATH);
    config.on('ready', function(config) {
      config.a.should.eql(_config.a);
      config.b.should.eql(_config.b);
    });

  });

  it('applies all of the config data to itself upon the callback', function() {

    var _config = require(TEST_CONFIG_PATH);
    new Config(TEST_CONFIG_PATH, function(err, config) {
      config.a.should.eql(_config.a);
      config.b.should.eql(_config.b);
    });

  });
});