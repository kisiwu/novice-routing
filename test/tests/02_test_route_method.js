import routing from '../../index.js'
import { expect } from 'chai'

const router = routing()

describe("Define routes and meta with 'route' method", () => {
  // define the homepage
  router.route({
    path: '/',
    description: 'homepage for example',
    name: 'homepage',
    tags: ['Index', 'Examples']
  }).get(function one(req, res, next) {
    next();
  }, function two(req, res) {
    res.send('home page')
  }).post(function two(req, res) {
    res.send('post to home page')
  });

  it("should have registered route", function() {
    expect(router.stack[0].route.path).to.equal('/');
  });

  it("should have registered meta", function() {
    expect(router.stack[0].route.meta.name).to.equal('homepage');
    expect(router.stack[0].route.meta.description).to.equal('homepage for example');
    expect(router.stack[0].route.meta.tags)
      .to.be.an('array', 'meta.tags in not an array')
      .to.eql(['Index', 'Examples']);
  });
});
