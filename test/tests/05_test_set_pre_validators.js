var kaukau = require("kaukau");

var router = require('../../index')();

describe("Register middlewares with meta 'preValidators'", () => {

  router.setAuthHandlers(function authMiddleware(req, res, next){
    // auth user
    next();
  },function authMiddleware2(req, res, next){
    // auth user
    next();
  });

  router.setValidators(function customValidator(req, res, next){
    next();
  });

  // define a route with preValidators
  router.get({
    path: '/comments',
    name: 'Comments',
    description: 'List of comment',
    auth: true,
    preValidators: function prevalidator(req, res, next) {next()},
    tags: 'Comments'
  }, function list(req, res) {
    res.json(req.meta)
  });


  it("should have added 'preValidator' layers before 'validator' Layers and after 'auth' Layers", function() {
    expect(router.stack[0].route.meta.name).to.equal('Comments');
    expect(router.stack[0].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(6, 'number of Layers is not correct');
    //- check Layers
    expect(router.stack[0].route.stack[0].type)
      .to.be.an('undefined');
    expect(router.stack[0].route.stack[1].type)
      .to.eql('auth');
    expect(router.stack[0].route.stack[2].type)
      .to.eql('auth');
    expect(router.stack[0].route.stack[3].type)
      .to.eql('preValidator');
    expect(router.stack[0].route.stack[4].type)
      .to.eql('validator');
    expect(router.stack[0].route.stack[5].type)
      .to.be.an('undefined');
  });
});
