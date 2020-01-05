var inherits = require('util').inherits
var ExpressRoute = require("express/lib/router/route");
var flatten = require('array-flatten');
var methods = require("methods");

var createMetadataMiddleware = require('./metadataMiddleware');

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

module.exports = Route;