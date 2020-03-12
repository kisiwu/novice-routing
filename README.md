# @novice1/routing

A small extension of [Express routing](https://expressjs.com/en/guide/routing.html).

## Installation

```bash
$ npm install @novice1/routing
```

## Usage

It keeps all the functionalities of Express router and extends them.

### Router

A JSON object can be sent as the `path` parameter when using route methods (`get`, `post`, ...), `all` and `route`. That object must have the property `path` and can also have the following properties:

- `name`: (string)
- `description`: (string)
- `parameters`: (object)
- `responses`: (object)
- `tags`: (string[])
- `auth`: (boolean)

Example:

```js
var router = require('@novice1/routing')()

router.get({
  path: '/',
  name: 'Home',
  description: 'Home page',
  parameters: {
    // ...
  },
  responses: {
    // ...
  },
  tags: ['Index']
}, function (req, res) {
  // information about the current route
  // can be found at req.meta
  res.json(req.meta)
})
```

### Auth

From those properties, only `path` and `auth` influence the routing.
When you need to verify the client's authentication the same way for a router's route, you can set middlewares with the method `setAuthHandlers`. Those middlewares will only be executed for routes with `auth` set to `true`.


```js
var router = require('@novice1/routing')()

// set middleware(s) to handle authentication
router.setAuthHandlers(function (req, res, next) {
  // do something
  next()
}, function (req, res, next) {
  // do something else
  next()
})

router.get({
  name: 'Home',
  path: '/'
}, function (req, res) {
  res.send('hello world')
})

router.get({
  auth: true, // handle the authentication for this route
  name: 'Management',
  path: '/admin'
}, function (req, res) {
  res.send('hello admin')
})
```

`setAuthHandlers` can be called before or after creating the routes.

### Validators

You can use `setValidators` to set handlers that valid the client's request.
Those middlewares have access to `req.meta` so you could make use of the property `parameters` for example.

```js
var router = require('@novice1/routing')()

router.get({
  name: 'Main app',
  // set parameters
  parameters: {
    query: {
      version: "number" // e.g.: the type that the query variable 'version' should have 
    }
  },
  path: '/app'
}, function (req, res) {
  res.json(req.meta)
})

// check requests for this router
router.setValidators(function (req, res, next) {
  if(req.meta.parameters.query.version == 'number') {
    if(!isNaN(req.query.version)) {
      // ok
      next()
    } else {
      // client's request is not valid
      res.status(400).send('Bad request')
    }
  } else {
    // ok
    next()
  }
})
```

`setValidators` can be called before or after creating the routes.

### Other methods

As a router can be a middleware of another router (`use` method), you might want to keep different `auth` and `validator` handlers for some routers. For example a router might have its own `auth` handlers while being `use`d by a router also having `auth` handlers. For that purpose there are some methods:

- `setAuthHandlersIfNone`
- `setValidatorsIfNone`

Example:

```js
var routing = require('@novice1/routing')

var routerChild = routing()

routerChild.get('/', function (req, res) {
  res.json(req.meta)
})

routerChild.setValidators(function (req, res, next) {
  next()
})

var routerParent = routing()

routerParent.put('/', function (req, res) {
  res.json(req.meta)
})

// use 'routerChild' in 'routerParent'
routerParent.use(routerChild)

// set validators for routes except for 
// those already having validators
routerParent.setValidatorsIfNone(function (req, res, next) {
  next()
})
```

## References

- [Express](https://expressjs.com/)