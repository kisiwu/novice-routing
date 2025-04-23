import routing from '../../index.js'
import { expect } from 'chai'

const router = routing()
const midRouter = routing()
const mainRouter = routing()

describe('Get meta from router', () => {
  router.all('/*splat', function allMiddleware(req, res, next) {
    next();
  });
  // define the about route
  router.get(
    {
      path: '/about',
      name: 'about',
      tags: ['About'],
    },
    function aboutToDo(req, res) {
      res.json(req.meta);
    }
  );
  // define the post route
  router.post(
    {
      path: ['/post', 'postable'],
      name: 'Post',
      description: 'Post a comment',
      tags: 'Comments',
    },
    function postToDo(req, res) {
      res.json(req.meta);
    }
  );

  /** Regexp are no longer supported since Express v5 so no need to worry about it anymore */
  // routes from here won't be found in meta
  // as meta only handles paths of type string or string[] 
  //midRouter.use(/\/regularExpress.*/, router);

  midRouter.use(router);

  mainRouter.use(['/main'], midRouter);

  const meta = mainRouter.getMeta().map((meta) => {
    meta.parameters;
    return meta;
  });

  it('should have the right amount of routes', function () {
    expect(meta.length).to.equal(4);
  });

  it('should have the right routes', function () {
    expect(meta[0].path).to.equal('/main/*splat');
    expect(meta[0].methods).to.deep.equal({_all: true});

    expect(meta[1].name).to.equal('about');
    expect(meta[1].path).to.equal('/main/about');
    expect(meta[1].methods).to.deep.equal({get: true});

    expect(meta[2].name).to.equal('Post');
    expect(meta[2].path).to.equal('/main/post');
    expect(meta[2].methods).to.deep.equal({post: true});

    expect(meta[3].name).to.equal('Post');
    expect(meta[3].path).to.equal('/main/postable');
    expect(meta[3].methods).to.deep.equal({post: true});
  });
});
