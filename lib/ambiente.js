
var path = require('path');
var fs = require('fs');

var Config = require('./config');
var ConfigLoader = require('./config-loader');

module.exports = exports = function(configDirPath, defaultsDirPath, callback) {
  return new ConfigLoader(configDirPath, defaultsDirPath, callback);
};

exports.Config = Config;
exports.ConfigLoader = ConfigLoader;