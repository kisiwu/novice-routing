var kaukau = require("kaukau");

var router = require('../../index')();

describe("Register middlewares using 'setMiddlewares'", () => {

  router.setAuthHandlers(function authMiddleware(req, res, next){
    // auth user
    next();
  },function authMiddleware2(req, res, next){
    // auth user
    next();
  });

  router.setMiddlewares(function customMiddleware(req, res, next){
    next();
  });

  // define a route with 'auth' set to false/undefined
  router.get({
    path: '/comments',
    name: 'Comments',
    description: 'List of comment',
    tags: 'Comments'
  }, function list(req, res) {
    res.json(req.routeMeta)
  });

  // define a route with 'auth' set to true
  router.put({
    path: '/comments/:id',
    name: 'Edit comment',
    description: 'Update a comment',
    auth: true,
    tags: 'Comments'
  }, function update(req, res) {
    res.json(req.routeMeta)
  });


  it("should have added 'middleware' Layers", function() {
    expect(router.stack[0].route.meta.name).to.equal('Comments');
    expect(router.stack[0].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(3);
    //- check Layers
    expect(router.stack[0].route.stack[0].type)
      .to.be.an('undefined');
    expect(router.stack[0].route.stack[1].type)
      .to.eql('middleware');
    expect(router.stack[0].route.stack[2].type)
      .to.be.an('undefined');
  });

  it("should have added 'middleware' Layers after 'auth' Layers", function() {
    expect(router.stack[1].route.meta.name).to.equal('Edit comment');
    expect(router.stack[1].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(5, 'number of Layers is different than expected');

    //- check Layers
    expect(router.stack[1].route.stack[0].type)
      .to.be.an('undefined');
    expect(router.stack[1].route.stack[1].type)
      .to.eql('auth');
    expect(router.stack[1].route.stack[2].type)
      .to.eql('auth');
    expect(router.stack[1].route.stack[3].type)
      .to.eql('middleware');
    expect(router.stack[1].route.stack[4].type)
      .to.be.an('undefined');

    expect(router.stack[1].route.stack[3].name)
      .to.eql('customMiddleware');

    // console.log(router.stack[1].route.stack)
  });
});
