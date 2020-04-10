var flatten = require('array-flatten');

/**
 * @param {Function[]} args
 */
exports.setAuthHandlers = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._auth = [].concat(handles);
  this._ifNoAuth = false;
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_auth', handles);
}

/**
 * @param {Function[]} args
 */
exports.setAuthHandlersIfNone = function(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._auth = [].concat(handles);
  this._ifNoAuth = true;
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.editLayers('set_auth_if_none', handles);
}