const router = require('../../index')();

describe("Define routes and meta", () => {

  router.all('/*', function allMiddleware (req, res, next) {
    next()
  });
  // define the about route
  router.get({
    path: '/about',
    name: 'about',
    tags: ['About']
  }, function aboutToDo(req, res) {
    res.json(req.meta)
  });
  // define the post route
  router.post({
    path: '/post',
    name: 'Post',
    description: 'Post a comment',
    tags: 'Comments'
  }, function postToDo(req, res) {
    res.json(req.meta)
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
    expect(router.stack[1].route.meta.tags)
      .to.be.an('array', 'meta.tags in not an array')
      .to.eql(['About']);
  });

  it("should have registered 'post' meta", function() {
    expect(router.stack[2].route.meta.name).to.equal('Post');
    expect(router.stack[2].route.meta.description).to.equal('Post a comment');
    expect(router.stack[2].route.meta.tags)
      .to.be.an('array', 'meta.tags in not an array')
      .to.eql(['Comments']);
  });
});
