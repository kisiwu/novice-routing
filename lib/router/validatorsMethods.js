var flatten = require('array-flatten');

/**
 * @param {Function[]} args
 */
exports.setValidators = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._validators = [].concat(handles);
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_validators', handles);
}

/**
 * @param {Function[]} args
 */
exports.setValidatorsIfNone = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._validators = [].concat(handles);
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_validators_if_none', handles);
}