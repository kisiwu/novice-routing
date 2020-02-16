var inherits = require('util').inherits
var ExpressRoute = require("express/lib/router/route");
var flatten = require('array-flatten');
var methods = require("methods");

var createMetadataMiddleware = require('./route/metadataMiddleware');
var createLayers = require('./route/createLayers');

/**
 * @classdesc Initialize `Route` with the given `path`,
 * @class
 * @augments ExpressRoute express/lib/router/route
 */
function Route() {
  return ExpressRoute.apply(this, Array.from(arguments));
}

inherits(Route, ExpressRoute);

methods.concat('all').forEach(function(method){
  /** @inheritdoc */
  Route.prototype[method] = function(){
    var handles = flatten(Array.prototype.slice.call(arguments));

    // add middleware to serve route's metadata in 'req'
    handles.unshift(createMetadataMiddleware(method, this.path, this.meta));

    return ExpressRoute.prototype[method].apply(this, handles);
  };
});

/**
 * @param {object} layerOptions
 * @param {Function[]} args
 */
Route.prototype.setAuth = function (layerOptions) {
  var handles = flatten(Array.prototype.slice.call(arguments, 1));

  this.removeAuth();

  // insert new layers for those functions
  if (
    Array.isArray(this.stack) && this.methods && this.path 
    && this.meta && this.meta.auth
    && handles.length){
    Object.keys(this.methods).forEach(
      method => {
        createLayers('auth', method, layerOptions, handles, this.dispatch.bind(this)).forEach(
          layer => {
            this.stack.splice(1, 0, layer);
          }
        );
      }
    );
  }
}

/**
 * @param {object} layerOptions
 * @param {Function[]} args
 */
Route.prototype.setValidators = function (layerOptions) {
  var handles = flatten(Array.prototype.slice.call(arguments, 1));

  this.removeValidators();

  // insert new layers for those functions
  if (
    Array.isArray(this.stack) && this.methods && this.path
    && handles.length){
    Object.keys(this.methods).forEach(
      method => {
        createLayers('validator', method, layerOptions, handles, this.dispatch.bind(this)).forEach(
          layer => {
            // insert 'validator' layers after 'auth' layers

            var pos = this.stack.length - 1;

            for (pos; pos > 0; pos -= 1) {
              if (this.stack[pos].type === 'auth') {
                break;
              }
            }

            pos += 1;

            // insert before
            this.stack.splice(pos, 0, layer);
          }
        );
      }
    );
  }
}

/**
 *
 */
Route.prototype.hasAuth = function () {
  return this.hasLayerType('auth');
}

/**
 *
 */
Route.prototype.hasValidators = function () {
  return this.hasLayerType('validators');
}

Route.prototype.hasLayerType = function (type) {
  if (Array.isArray(this.stack)){
    return this.stack.some(
      layer => layer.type === type
    );
  }
  return false;
}

/**
 *
 */
Route.prototype.removeAuth = function () {
  this.removeLayerType('auth');
}

/**
 *
 */
Route.prototype.removeValidators = function () {
  this.removeLayerType('validators');
}

Route.prototype.removeLayerType = function (type) {
  if (Array.isArray(this.stack)){
    this.stack = this.stack.filter(
      layer => layer.type !== type
    );
  }
}

module.exports = Route;