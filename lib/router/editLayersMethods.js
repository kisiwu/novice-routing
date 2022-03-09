var { flatten } = require('array-flatten');

exports.editLayers = function(method) {
  var args = flatten(Array.prototype.slice.call(arguments, 1));
  this.stack.forEach(
    routerLayer => {
      if (typeof routerLayer[method] === 'function') {
        routerLayer[method].apply(routerLayer, args);
      }
    }
  );
}