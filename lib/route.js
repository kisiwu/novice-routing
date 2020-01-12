var inherits = require('util').inherits
var ExpressRoute = require("express/lib/router/route");
var flatten = require('array-flatten');
var methods = require("methods");

var createMetadataMiddleware = require('./metadataMiddleware');
var createAuthLayers = require('./authLayers');

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
        createAuthLayers(method, layerOptions, handles, this.dispatch.bind(this)).forEach(
          layer => {
            this.stack.splice(1, 0, layer);
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
  if (Array.isArray(this.stack)){
    this.stack = this.stack.filter(
      layer => !layer.auth
    );
  }
}

module.exports = Route;