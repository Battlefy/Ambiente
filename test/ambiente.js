
// modules
var path = require('path');

// libs
var ambiente = require('../');
var Config = require('../lib/config');

// constants
var CONFIG_PATH = path.resolve(__dirname, './fixtures/dev');

describe('ambiente', function() {

  it('wraps the config loader class', function() {
    var config = ambiente(CONFIG_PATH);
    config.should.be.an.instanceOf(Config);
  });

});

describe('ambiente.Config', function() {

  it('references the Config class', function() {
    ambiente.Config.should.equal(Config);
  });

});