
// modules
var path = require('path');

// lib
var ConfigLoader = require('../lib/config-loader');

// constants
var CONFIG_PATH = path.resolve(__dirname, './fixtures/dev');
var DEFAULTS_PATH = path.resolve(__dirname, './fixtures/app');

describe('configLoader', function() {

  it('accepts a config path', function() {
    var config = new ConfigLoader(CONFIG_PATH);
  });

  it('accepts a config path and defaults path', function() {
    var config = new ConfigLoader(CONFIG_PATH, DEFAULTS_PATH);
  });

  it('accepts a config path, defaults path, and callback', function(done) {
    var config = new ConfigLoader(CONFIG_PATH, DEFAULTS_PATH, done);
  });

  it('accepts a config path and callback', function(done) {
    var config = new ConfigLoader(CONFIG_PATH, done);
  });

  it('sets the config namespaces on its instance', function() {
    new ConfigLoader(CONFIG_PATH, function(err, config) {
      if(err) { throw err; }
      config.test.should.be.OK;
      config.test.name.should.equal('prod');
      config.test.a.should.OK;
      config.test.a.foo.should.equal('bar');
      config.namespace.should.be.OK;
      config.namespace.subTest.should.be.OK;
      config.namespace.subTest.sub.should.equal('val');
    });
  });

});