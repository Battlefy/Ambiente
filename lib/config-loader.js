
// modules
var util = require('util');
var fs = require('fs');
var path = require('path');
var tools = require('primitive');
var EventEmitter = require('events').EventEmitter;

// libs
var Config = require('./config');


function ConfigLoader(configPath, defaultsPath, callback) {
  var _this = this;
  EventEmitter.call(this);

  // allow a function to be passed as the second
  // parameter,
  if(typeof defaultsPath == 'function') {
    callback = defaultsPath;
    defaultsPath = undefined;
  }

  // setup the isntance
  this._defaultsPath = defaultsPath;
  this._path = configPath;
  this._configs = {};
  this._reservedProperties = [];
  for(var property in this) {
    this._reservedProperties.push(property);
  }

  // setup a callback for loading the configs
  // so its possible to load defaults first.
  var next = function(err) {
    if(err && callback) { callback(err); return; }
    if(err) { _this.emit('error', err); return; }

    // load in all the configs.
    _this._gatherConfigs(_this._path, function(err) {
      if(err && callback) { callback(err); return; }
      if(err) { _this.emit('error', err); return; }
      if(callback) { callback(undefined, _this); }
    });

    // proxy JSON paths as events to each config
    _this.on('newListener', function(event) {
      if(_this._proxiedEvents.indexOf(event) > -1) { return; }
      _this._proxiedEvents.push(event);

      // find the config matching the beginning of
      // the event.
      for(var configPath in _this.configs) {
        if(event.slice(0, configPath.length) == configPath) {
          var configName = event.slice(0, configPath.length);
          var configPath = event.slice(configName.length + 1);
          break;
        }
      }

      // do nothing if the path is invalid
      if(!configName || !configPath) { return; }

      // bind the config path event
      _this._configs[configName].on(configPath, function(data) {
        _this.emit(event, data);
      });
    });

  };

  // load in defaults first, otherwise call next.
  if(defaultsPath) { this._gatherConfigs(this._defaultsPath, next); }
  else { next(); }
}
util.inherits(ConfigLoader, EventEmitter);

ConfigLoader.prototype._gatherConfigs = function(configsPath, callback) {
  var _this = this;

  (function exec(configsPath, rootObj, namespace, callback) {

    // read in the config path
    fs.readdir(configsPath, function(err, dir) {
      if(err) { callback(err); return; }


      // create a function for executing the
      // callback once all configs are loaded.
      var i = dir.length;
      var next = function(err) {
        if(err && i) { callback(err); i = 0; return; }
        i -= 1;
        if(i == 0) { callback(); }
      };

      // if there are no configs then just call next
      if(i == 0) { callback(); return; }

      // process each filename within the directory
      dir.forEach(function(fileName) {

        // get filename, file extention, file id,
        // and filePath.
        var fileExt = path.extname(fileName);
        var fileId = tools.camelize(path.basename(fileName, fileExt));
        var filePath = path.join(configsPath, fileName);

        // Preform a stat on the file
        fs.stat(filePath, function(err, stat) {

          // if the file is a directory then
          // load it as a namespace
          if(stat.isDirectory()) {
            rootObj[fileId] = rootObj[fileId] || {};
            exec(filePath, rootObj[fileId], namespace + '.' + fileId, next);
          }

          // else if the file is a json file
          else if(stat.isFile() && fileExt == '.json') {
            rootObj[fileId] = rootObj[fileId] || {};
            _this._configs[namespace + '.' + fileId] = _this._loadConfig(filePath, function(err, config) {
              tools.merge(rootObj[fileId], config);
              next();
            });
          }

          // else just continue
          else { next(); }

        });
      });
    });

  })(configsPath, this, '', callback);
}

ConfigLoader.prototype._loadConfig = function(configPath, callback) {
  return new Config(configPath, callback);
};


module.exports = ConfigLoader;
