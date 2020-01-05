var kaukau = require("kaukau");
var Logger = kaukau.Logger;

var router = require('../../index')();

describe("Define routes and meta", () => {

  router.all('/*', function allMiddleware (req, res, next) {
    next()
  });
  // define the about route
  router.get({
    path: '/about',
    name: 'about',
    stacks: ['About']
  }, function aboutToDo(req, res) {
    res.json(req.routeMeta)
  });
  // define the post route
  router.post({
    path: '/post',
    name: 'Post',
    description: 'Post a comment',
    stacks: 'Comments'
  }, function aboutToDo(req, res) {
    res.json(req.routeMeta)
  });

  it("should have registered 'all' route", function() {
    expect(router.stack[0].route.path).to.equal('/*');
  });

  it("should have registered 'get' route", function() {
    expect(router.stack[1].route.path).to.equal('/about');
  });

  it("should have registered 'post' route", function() {
    expect(router.stack[2].route.path).to.equal('/post');
  });

  it("should have registered 'get' meta", function() {
    expect(router.stack[1].route.meta.name).to.equal('about');
    expect(router.stack[1].route.meta.stacks)
      .to.be.an('array', 'meta.stacks in not an array')
      .to.eql(['About']);
  });

  it("should have registered 'post' meta", function() {
    expect(router.stack[2].route.meta.name).to.equal('Post');
    expect(router.stack[2].route.meta.description).to.equal('Post a comment');
    expect(router.stack[2].route.meta.stacks)
      .to.be.an('array', 'meta.stacks in not an array')
      .to.eql(['Comments']);
  });
});
