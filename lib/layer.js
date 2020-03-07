var inherits = require('util').inherits;
var flatten = require('array-flatten');
var ExpressLayer = require("express/lib/router/layer");

function Layer() {
  var args = Array.from(arguments);
  ExpressLayer.apply(this, args);

  this.get_meta = get_meta;
  this.set_auth = set_auth;
  this.set_auth_if_none = set_auth_if_none;
  this.set_validators = set_validators;
  this.set_validators_if_none = set_validators_if_none;
  this.meta_path = args[0];
}

inherits(Layer, ExpressLayer);

function get_meta(path) {
  var v = [];
  if(path) {
    path += this.meta_path;
    path = path.replace(/\/{2,}/g, '/');
  } else {
    path = this.meta_path;
  }
  if (this.route) {
    var tmpMeta = {
      path: `${path}`,
      methods: this.route.methods
    };
    if(this.route.meta) {
      Object.keys(this.route.meta).forEach(
        k => {
          tmpMeta[k] = this.route.meta[k]
        }
      );
    }
    v.push(tmpMeta);
  }

  if (this.handle && this.handle.stack) {
    this.handle.stack.forEach(layer => {
      if (layer && typeof layer.get_meta === 'function') {
        v.push.apply(v,flatten(layer.get_meta(path)));
      }
    });
  }

  return v;
}

function set_auth() {
  if (this.route) {
    if(typeof this.route.setAuth === 'function') {
      var args = flatten(Array.prototype.slice.call(arguments));
      this.route.setAuth.apply(this.route, args);
    }
  }

  if (this.handle && typeof this.handle.setAuthHandlers === 'function') {
    var argsForRouter = flatten(Array.prototype.slice.call(arguments));
    argsForRouter.shift();
    this.handle.setAuthHandlers.apply(this.handle, argsForRouter);
  }
}

function set_auth_if_none() {
  if (this.route) {
    if(typeof this.route.hasAuth === 'function' && !this.route.hasAuth()) {
      var args = flatten(Array.prototype.slice.call(arguments));
      this.route.setAuth.apply(this.route, args);
    }
  }

  if (this.handle && typeof this.handle.setAuthHandlersIfNone === 'function') {
    var argsForRouter = flatten(Array.prototype.slice.call(arguments));
    argsForRouter.shift();
    this.handle.setAuthHandlersIfNone.apply(this.handle, argsForRouter);
  }
}

function set_validators() {
  if (this.route) {
    if(typeof this.route.setValidators === 'function') {
      var args = flatten(Array.prototype.slice.call(arguments));
      this.route.setAuth.apply(this.route, args);
    }
  }

  if (this.handle && typeof this.handle.setValidators === 'function') {
    var argsForRouter = flatten(Array.prototype.slice.call(arguments));
    argsForRouter.shift();
    this.handle.setValidators.apply(this.handle, argsForRouter);
  }
}

function set_validators_if_none() {
  if (this.route) {
    if(typeof this.route.hasValidators === 'function' && !this.route.hasValidators()) {
      var args = flatten(Array.prototype.slice.call(arguments));
      this.route.setValidators.apply(this.route, args);
    }
  }

  if (this.handle && typeof this.handle.setValidatorsIfNone === 'function') {
    var argsForRouter = flatten(Array.prototype.slice.call(arguments));
    argsForRouter.shift();
    this.handle.setValidatorsIfNone.apply(this.handle, argsForRouter);
  }
}

module.exports = Layer;