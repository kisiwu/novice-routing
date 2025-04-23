import routing from '../../index.js'
import { expect } from 'chai'

const router = routing()

describe("Define 'auth' routes and register middlewares using 'setAuthHandlers'", () => {

  // register handlers for authentication
  // for all routes with:
  //   - 'auth' set to true
  //   - registered to this router
  router.setAuthHandlersIfNone(function authMiddleware(req, res, next){
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
    tags: 'Comments'
  }, function list(req, res) {
    res.json(req.meta)
  });

  // define a route with 'auth' set to true
  router.put({
    path: '/comments/:id',
    name: 'Edit comment',
    description: 'Update a comment',
    auth: true,
    tags: 'Comments'
  }, function update(req, res) {
    res.json(req.meta)
  });


  it("should NOT have added 'auth' Layers for route with 'auth' to false", function() {
    expect(router.stack[0].route.meta.name).to.equal('Comments');
    expect(router.stack[0].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(2);
    //- check Layers
    expect(router.stack[0].route.stack[0].type)
      .to.be.an('undefined');
    expect(router.stack[0].route.stack[1].type)
      .to.be.an('undefined');
  });

  it("should have added 'auth' Layers for route with 'auth' to true", function() {
    expect(router.stack[1].route.meta.name).to.equal('Edit comment');
    expect(router.stack[1].route.stack)
      .to.be.an('array', 'route is missing stack of Layers')
      .to.have.lengthOf(4, 'number of Layers is different than expected');

    //- check Layers
    expect(router.stack[1].route.stack[0].type)
      .to.be.an('undefined');
    expect(router.stack[1].route.stack[1].type)
      .to.eql('auth');
    expect(router.stack[1].route.stack[2].type)
      .to.eql('auth');
    expect(router.stack[1].route.stack[3].type)
      .to.be.an('undefined');

    //- check if the right handlers are in the 'auth' Layers
    expect(router.stack[1].route.stack[1].name)
      .to.eql('authMiddleware');
    expect(router.stack[1].route.stack[2].name)
      .to.eql('authMiddleware2');
  });
});
