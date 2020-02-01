var inherits = require('util').inherits
var ExpressRoute = require("express/lib/router/route");
var flatten = require('array-flatten');
var methods = require("methods");

var createMetadataMiddleware = require('./metadataMiddleware');
var createLayers = require('./createLayers');

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
Route.prototype.setMiddlewares = function (layerOptions) {
  var handles = flatten(Array.prototype.slice.call(arguments, 1));

  this.removeMiddlewares();

  // insert new layers for those functions
  if (
    Array.isArray(this.stack) && this.methods && this.path
    && handles.length){
    Object.keys(this.methods).forEach(
      method => {
        createLayers('middleware', method, layerOptions, handles, this.dispatch.bind(this)).forEach(
          layer => {
            // insert 'middleware' layers after 'auth' layers

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
Route.prototype.removeAuth = function () {
  this.removeLayerType('auth');
}

/**
 *
 */
Route.prototype.removeMiddlewares = function () {
  this.removeLayerType('middleware');
}

Route.prototype.removeLayerType = function (type) {
  if (Array.isArray(this.stack)){
    this.stack = this.stack.filter(
      layer => layer.type !== type
    );
  }
}

module.exports = Route;