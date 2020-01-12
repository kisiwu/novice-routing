var ExpressRouter = require("express").Router;
var Layer = require("express/lib/router/layer");
var flatten = require('array-flatten');
var methods = require("methods");

var Route = require("./route");

/**
 * @classdesc Initialize a new `Router` with the given `options`.
 * @class
 * @augments ExpressRouter express/lib/router
 */
function Router() {
  var router = ExpressRouter.apply(this, Array.from(arguments));
  overrideRouterMethods(router);
  addProperties(router);
  return router;
}

/** @inheritdoc */
function route(path) {
  // add metadata in route
  var meta = {};

  // if path argument is an object, get property 'path'
  if (path && typeof path === "object") {
    Object.keys(path).forEach(p => {
      switch (p) {
        case "path":
          break;
        case "auth":
          meta[p] = Boolean(path[p]);
          break;
        case "name":
        case "description":
          meta[p] = path[p];
          if (typeof meta[p] !== "string") {
            meta[p] = JSON.stringify(meta[p]);
          }
          break;
        case "parameters":
        case "responses":
          if (path[p] && typeof path[p] === 'object')
            meta[p] = path[p];
          break;
        case "stacks":
          if (!meta.stacks) {
            meta[p] = [];
          }
          var pStacks = path[p];
          if (!Array.isArray(pStacks)) {
            pStacks = [pStacks];
          }
          pStacks.forEach(s => {
            if (typeof s === "string") {
              meta[p].push(s);
            }
          });
          break;
        default:
          // meta[p] = path[p];
          break;
      }
    });

    path = path.path;
  }

  // initialize route
  var route = new Route(path);
  route.meta = meta;

  // initialize layer
  var layer = new Layer(
    path,
    {
      sensitive: this.caseSensitive,
      strict: this.strict,
      end: true
    },
    route.dispatch.bind(route)
  );

  layer.route = route;

  this.stack.push(layer);
  return route;
}

/**
 * @param {Function[]} args
 */
function setAuthHandlers(){
  var handles = flatten(Array.prototype.slice.call(arguments));
  this._auth = [].concat(handles);
  // add layer options
  handles.unshift({
    sensitive: this.caseSensitive,
    strict: this.strict,
    end: true
  });
  this.stack.forEach(
    routerLayer => {
      // beware: no 'route' property for middlewares
      // registered with 'use' method
      if (routerLayer.route) {
        routerLayer.route.setAuth.apply(routerLayer.route, handles);
      }
    }
  );
}

/**
 * @description Override methods of a router.
 * @param {*} router
 */
function overrideRouterMethods(router) {
  // override express Router's 'route' method
  router.route = route;

  // override methods
  methods.concat('all').forEach(function(method){
    router[method] = function(path){
      var route = this.route(path)
      route[method].apply(route, Array.prototype.slice.call(arguments, 1));

      // if there are 'auth' handlers
      if (this._auth.length) {
        var handles = this._auth.concat([]);
        // add layer options
        handles.unshift({
          sensitive: this.caseSensitive,
          strict: this.strict,
          end: true
        });
        route.setAuth.apply(route, handles);
      }

      return this;
    };
  });
}

/**
 * @description Add properties to a router.
 * @param {*} router
 */
function addProperties(router) {
  // add '_auth' property to store handlers
  Object.defineProperty(router, '_auth', {
    value: [],
    writable: true
  });
  // add 'setAuthHandlers' method (stores handlers into '_auth')
  Object.defineProperty(router, 'setAuthHandlers', {
    value: setAuthHandlers,
    writable: true
  });
}

module.exports = Router;