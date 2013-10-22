
var util = require('util');
var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var JSONStream = require('JSONStream');


function Config(path, callback) {
  var _this = this;
  EventEmitter.call(this);

  // set the path
  this.path = path;

  // setup the instance
  this._proxiedEvents = [];
  this._reservedProperties = [];
  for(var property in this) {
    this._reservedProperties.push(property);
  }
  this._readStream = fs.createReadStream(this.path, {
    encoding: 'utf8'
  });

  // if a callback is given then buffer parse
  // the read stream, then, once complete,
  // callback with the full config object.
  if(typeof callback == 'function') {
    // when the read stream is finished then return
    // the data.
    var data = '';
    this._readStream.on('error', callback);
    this._readStream.on('data', function(chunk) {
      data += chunk;
    });
    this._readStream.on('end', function() {

      // attempt to parse as JSON
      try {
        data = JSON.parse(data);
      } catch(err) {
        callback(err);
        return;
      }

      // apply the data to the instance
      _this._applyData(data);

      // emit a ready event and call the callback
      // with the full data.
      this.emit('ready', _this);
      callback(undefined, _this);
    });
  }
  
  // proxy JSON paths as events on the readStream.
  this.on('newListener', function(event) {
    if(_this._proxiedEvents.indexOf(event) > -1) { return; }
    _this._proxiedEvents.push(event);
    _this._readStream
      .pipe(JSONStream.parse(event))
      .on('data', function(data) {
        _this.emit(event, data);
      });
  });
}
util.inherits(Config, EventEmitter);

Config.prototype._applyData = function(data) {
  for(var property in data) {
    var val = data[property];
    if(this._reservedProperties.indexOf(property) > -1) {
      property = '__' + property;
    }
    this[property] = val;
  }
};

module.exports = Config;
