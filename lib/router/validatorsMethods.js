var { flatten } = require('array-flatten');

/**
 * @param {Function[]} args
 */
exports.setValidators = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._validators = [].concat(handles);
  this._ifNoValidators = false;
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_validators', handles);

  return this;
}

/**
 * @param {Function[]} args
 */
exports.setValidatorsIfNone = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._validatorsIfNone = [].concat(handles);
  this._ifNoValidators = true;
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_validators_if_none', handles);

  return this;
}