/**
 * 
 * @param {string} method 
 * @param {string} path 
 * @param {object} meta
 * @returns {Function}
 */
function createMetadataMiddleware(method, path, meta) {
  var requestMeta = {
    method: method
  };
  if (path && path.indexOf("//") == 0) {
    path = path.replace("//", "/");
  }
  requestMeta.path = path;

  if (meta) {
    ['auth', "name", "description", 'tags', "parameters", "responses"].forEach(
      p => {
        if (typeof meta[p] !== 'undefined')
          requestMeta[p] = meta[p];
      }
    );
  }

  return function noviceRouteMetadataMiddleware(req, res, next) {
    req.routeMeta = requestMeta;
    next();
  };
}

module.exports = createMetadataMiddleware;