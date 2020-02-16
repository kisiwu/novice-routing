var flatten = require('array-flatten');

exports.getMeta = function() {
  var v = [];
  this.stack.forEach(
    routerLayer => {
      // only layers with method 'get_meta'
      if (typeof routerLayer.get_meta === 'function') {
        v.push.apply(v, flatten(routerLayer.get_meta()));
      }
    }
  );
  return v;
}