
// modules
var path = require('path');

// lib
var ConfigLoader = require('../lib/config-loader');

// constants
var APP_PATH = path.resolve(__dirname, 'fixtures/app');
var DEV_PATH = path.resolve(__dirname, 'fixtures/dev');

describe('configLoader', function() {

  it('accepts a config directory', function() {
    new ConfigLoader(DEV_PATH);
  });

  it('accepts a config directory, and a default config directory', function() {
    new ConfigLoader(DEV_PATH, APP_PATH, function(err, configLoader) {
      console.log(err, configLoader);
    });
  });



});