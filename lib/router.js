var ExpressRouter = require("express").Router;
var flatten = require('array-flatten');
var methods = require("methods");
var debug = require('debug')('novice1:router');

// custom
var Layer = require("./layer");
var Route = require("./route");

// custom methods
var editLayersMethods = require('./router/editLayersMethods');
var authMethods = require('./router/authMethods');
var validatorsMethods = require('./router/validatorsMethods');
var metaMethods = require('./router/metaMethods');


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
        case "tags":
          if (!meta.tags) {
            meta[p] = [];
          }
          var pTags = path[p];
          if (!Array.isArray(pTags)) {
            pTags = [pTags];
          }
          pTags.forEach(s => {
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

/** @inheritdoc */
function use(fn) {
  var offset = 0;
  var path = '/';

  // default path to '/'
  // disambiguate router.use([fn])
  if (typeof fn !== 'function') {
    var arg = fn;

    while (Array.isArray(arg) && arg.length !== 0) {
      arg = arg[0];
    }

    // first arg is the path
    if (typeof arg !== 'function') {
      offset = 1;
      path = fn;
    }
  }

  var callbacks = flatten(Array.prototype.slice.call(arguments, offset));

  if (callbacks.length === 0) {
    throw new TypeError('Router.use() requires a middleware function')
  }

  for (var i = 0; i < callbacks.length; i++) {
    var fn = callbacks[i];

    if (typeof fn !== 'function') {
      throw new TypeError('Router.use() requires a middleware function but got a ' + gettype(fn))
    }

    // add the middleware
    debug('use %o %s', path, fn.name || '<anonymous>')

    var layer = new Layer(path, {
      sensitive: this.caseSensitive,
      strict: false,
      end: false
    }, fn);

    layer.route = undefined;

    this.stack.push(layer);
  }

  return this;
};

/**
 * @description Override methods of a router.
 * @param {*} router
 */
function overrideRouterMethods(router) {
  // override express Router's 'route' method
  router.route = route;
  router.use = use;

  // override methods
  methods.concat('all').forEach(function(method){
    router[method] = function(path){
      var route = this.route(path)
      route[method].apply(route, Array.prototype.slice.call(arguments, 1));

      // if there are:
      // - 'auth' handlers
      // - 'validators' handlers
      [
        {
          prop: '_auth',
          action: 'setAuth'
        },
        {
          prop: '_validators',
          action: 'setValidators'
        }
      ].forEach((v) => {
        if (this[v.prop].length) {
          var handles = this[v.prop].concat([]);
          // add layer options
          handles.unshift({
            sensitive: this.caseSensitive,
            strict: this.strict,
            end: true
          });
          route[v.action].apply(route, handles);
        }
      });

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
  // add '_validators' property to store handlers
  Object.defineProperty(router, '_validators', {
    value: [],
    writable: true
  });

  // add 'setAuthHandlers' method (stores handlers into '_auth')
  Object.defineProperty(router, 'setAuthHandlers', {
    value: authMethods.setAuthHandlers,
    writable: true
  });
  // add 'setAuthHandlersIfNone' method (stores handlers into '_auth')
  Object.defineProperty(router, 'setAuthHandlersIfNone', {
    value: authMethods.setAuthHandlersIfNone,
    writable: true
  });

  // add 'setValidators' method (stores handlers into '_validators')
  Object.defineProperty(router, 'setValidators', {
    value: validatorsMethods.setValidators,
    writable: true
  });
  // add 'setValidatorsIfNone' method (stores handlers into '_validators')
  Object.defineProperty(router, 'setValidatorsIfNone', {
    value: validatorsMethods.setValidatorsIfNone,
    writable: true
  });

  // add 'editLayers' method
  Object.defineProperty(router, 'editLayers', {
    value: editLayersMethods.editLayers,
    writable: true
  });

  // add 'getMeta' method
  Object.defineProperty(router, 'getMeta', {
    value: metaMethods.getMeta,
    writable: true
  });
}

module.exports = Router;