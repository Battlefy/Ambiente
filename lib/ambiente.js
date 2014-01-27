
var Config = require('./config');

module.exports = exports = function(configDirPath, defaultsDirPath) {
  return new Config(configDirPath, defaultsDirPath);
};

exports.Config = Config;