
// modules
var fs = require('fs');
var path = require('path');
var tools = require('primitive');
var EventEmitter = require('events').EventEmitter;


function Config(configPath, defaultsPath) {
  var _this = this;

  if(typeof configPath != 'string') { throw new Error('configPath is not a string'); }
  if(defaultsPath && typeof defaultsPath != 'string') { throw new Error('defaultsPath is not a string'); }

  // setup the instance
  this.defaultsPath = defaultsPath || null;
  this.configPath = configPath;

  // load the config
  var config = this._getConfigSet(this.configPath);

  // load defaults
  if(this.defaultsPath) {
    var defaults = this._getConfigSet(this.defaultsPath);
    config = tools.merge(defaults, config, true);
  }

  for(var prop in config) {
    this[prop] = config[prop];
  }
}

Config.prototype._getConfigSet = function(configPath) {
  if(!fs.existsSync(configPath)) {
    throw new Error('Config not found at ' + configPath);
  }

  // if the path is a file then load its as a
  // single config, otherwise load it as a config
  // set (directory of configs).
  var stat = fs.statSync(configPath);
  if(stat.isFile()) {
    return this._getConfig(configPath);
  } else if(stat.isDirectory()) {
    var configSet = {};
    var dir = fs.readdirSync(configPath);
    for(var i = 0; i < dir.length; i += 1) {
      var filename = dir[i];
      var namespace = this._getNamespace(filename);
      var _configPath = path.join(configPath, filename);
      var _stat = fs.statSync(_configPath);
      if(_stat.isFile() && path.extname(filename) == '.json') {
        configSet[namespace] = this._getConfig(_configPath);
      } else if(_stat.isDirectory()) {
        configSet[namespace] = this._getConfigSet(_configPath);
      }
    }
    return configSet;
  }

  try {
    return JSON.parse(fs.readFileSync(configPath));
  } catch(err) {
    throw new Error('Cannot parse json config file ' + configPath);
  }
};

Config.prototype._getConfig = function(configPath) {
  if(!fs.existsSync(configPath)) {
    throw new Error('Config not found at ' + configPath);
  }
  try {
    return JSON.parse(fs.readFileSync(configPath));
  } catch(err) {
    throw new Error('Cannot parse json config file ' + configPath);
  }
};

Config.prototype._getNamespace = function(filename) {
  var extname = path.extname(filename);
  var basename = path.basename(filename, extname);
  return tools.camelize(basename);
};


module.exports = Config;
