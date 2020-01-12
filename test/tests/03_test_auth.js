var kaukau = require("kaukau");

var router = require('../../index')();

describe("Define 'auth' route and register 'auth' middleware", () => {

  // register handlers for authentication
  // for all routes with:
  //   - 'auth' set to true
  //   - registered to this router
  router.setAuthHandlers(function authMiddleware(req, res, next){
    // auth user
    next();
  },function authMiddleware2(req, res, next){
    // auth user
    next();
  });

  // define a route with 'auth' set to false/undefined
  router.get({
    path: '/comments',
    name: 'Comments',
    description: 'List of comment',
    stacks: 'Comments'
  }, function list(req, res) {
    res.json(req.routeMeta)
  });

  // define a route with 'auth' set to true
  router.put({
    path: '/comments/:id',
    name: 'Edit comment',
    description: 'Update a comment',
    auth: true,
    stacks: 'Comments'
  }, function update(req, res) {
    res.json(req.routeMeta)
  });


  it("should NOT have added 'auth' Layers for route with 'auth' to false", function() {
    expect(router.stack[0].route.meta.name).to.equal('Comments');
    expect(router.stack[0].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(2);
    //- check Layers
    expect(router.stack[0].route.stack[0].auth)
      .to.be.an('undefined');
    expect(router.stack[0].route.stack[1].auth)
      .to.be.an('undefined');
  });

  it("should have added 'auth' Layers for route with 'auth' to true", function() {
    expect(router.stack[1].route.meta.name).to.equal('Edit comment');
    expect(router.stack[1].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(4, 'number of Layers is different than expected');

    //- check Layers
    expect(router.stack[1].route.stack[0].auth)
      .to.be.an('undefined');
    expect(router.stack[1].route.stack[1].auth)
      .to.be.true;
    expect(router.stack[1].route.stack[2].auth)
      .to.be.true;
    expect(router.stack[1].route.stack[3].auth)
      .to.be.an('undefined');

    //- check if the right handlers are in the 'auth' Layers
    expect(router.stack[1].route.stack[1].name)
      .to.eql('authMiddleware');
    expect(router.stack[1].route.stack[2].name)
      .to.eql('authMiddleware2');
  });
});
