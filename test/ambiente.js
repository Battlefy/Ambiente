
// modules
var path = require('path');

// libs
var ambiente = require('../');
var ConfigLoader = require('../lib/config-loader');
var Config = require('../lib/config');

// constants
var CONFIG_PATH = path.resolve(__dirname, './fixtures/dev');

describe('ambiente', function() {

  it('wraps the config loader class', function() {
    var config = ambiente(CONFIG_PATH);
    config.should.be.an.instanceOf(ConfigLoader);
  });

});

describe('ambiente.Config', function() {

  it('references the Config class', function() {
    ambiente.Config.should.equal(Config);
  });

});

describe('ambiente.ConfigLoader', function() {
  
  it('references the ConfigLoader class', function() {
    ambiente.ConfigLoader.should.equal(ConfigLoader);
  });

});