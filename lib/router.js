var ExpressRouter = require("express").Router;
var Layer = require("express/lib/router/layer");
var Route = require("./route");

/**
 * @classdesc Initialize a new `Router` with the given `options`.
 * @class
 * @augments ExpressRouter express/lib/router
 */
function Router() {
  var router = ExpressRouter.apply(this, Array.from(arguments));
  overrideRouterMethods(router);
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
 * @description Override methods of a router.
 * @param {*} router
 */
function overrideRouterMethods(router) {
  // override express Router's 'route' method
  router.route = route;
}

module.exports = Router;