// var Layer = require("./layer"); // no need for extra methods if layer is inside a Route
var Layer = require("express/lib/router/layer");

/**
 * @description returns Layers in opposite order
 * @param {string} type type of layer
 * @param {string} method 
 * @param {object} layerOptions 
 * @param {Function[]} handles 
 * @param {any} dispatchBind
 * @returns {Layer[]}
 */
function createLayers(type, method, layerOptions, handles, dispatchBind) {
  var layers = [];

  handles.forEach(
    handle => {
    /**
     * @todo review the layer arguments
     */
    var layer = new Layer(
      "/", // TO REVIEW: '/' OR this.path ?
      layerOptions,
      dispatchBind
    );

    layer.handle = handle;
    layer.name = handle.name;
    layer.method = method;
    // layer[type] = true;
    layer.type = type;

    layers.unshift(layer);
  });

  return layers;
}

module.exports = createLayers;
