
var path = require('path');
var fs = require('fs');

var Config = require('./config');
var ConfigLoader = require('./config-loader');

modules.exports = exports = function(configDirPath, appConfigPath, callback) {

  // set defaults
  if(typeof appConfigPath == 'function') {
    callback = appConfigPath;
    appConfigPath = 'app';
  }

  // resolve paths
  var appConfigPath = path.resolve(configDirPath, appConfigPath);

  // create a loader of each env
  return new ConfigLoader(configDirPath, appConfigPath, callback);
};

exports.Config = Config;
exports.ConfigLoader = ConfigLoader;