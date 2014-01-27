
// modules
var path = require('path');

// lib
var Config = require('../lib/config');

// constants
var CONFIG_PATH = path.resolve(__dirname, './fixtures/dev');
var DEFAULTS_PATH = path.resolve(__dirname, './fixtures/app');

describe('config', function() {

  it('accepts a config path', function() {
    var config = new Config(CONFIG_PATH);
  });

  it('accepts a config path and defaults path', function() {
    var config = new Config(CONFIG_PATH, DEFAULTS_PATH);
  });

  it('sets the config namespaces on its instance', function() {
    var config = new Config(CONFIG_PATH);
    config.test.should.be.OK;
    config.test.file.should.equal('dev');
    config.namespace.should.be.OK;
    config.namespace.subTest.should.be.OK;
    config.namespace.subTest.sub.should.equal('val');
  });

  it('sets the config namespaces on its instance', function() {
    var config = new Config(CONFIG_PATH, DEFAULTS_PATH);
    config.test.should.be.OK;
    config.test.name.should.equal('app');
    config.test.file.should.equal('dev');
    config.test.a.should.OK;
    config.test.a.foo.should.equal('bar');
    config.test.b.should.OK;
    config.test.b.baz.should.equal('ack');
    config.namespace.should.be.OK;
    config.namespace.subTest.should.be.OK;
    config.namespace.subTest.sub.should.equal('val');
  });

});