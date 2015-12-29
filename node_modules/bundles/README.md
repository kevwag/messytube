# bundles

Flexible standalone middleware stacker with hooks. This is useful for bundling together functionality as one standalone middleware for use with other modules like [Connect](https://www.npmjs.org/package/connect) or [Express](https://www.npmjs.org/package/express).

## Install

```
npm install bundles --save
```

## Usage

Basic

```js
var bundles = require('bundles');
var connect = require('connect');

var bundle = bundles();

bundle.use(function (req, res, next) {
  // do something
  next();
});

app.use(bundle);

app.listen(3000, function () {
  
});
```

Hooks and named middleware

```js
var bundles = require('bundles');
var connect = require('connect');

var bundle = bundles();

bundle.use('bundle1', function (req, res, next) {
  // do something
  next();
});

bundle.useBefore('bundle1', function (req, res, next) {
  // executes before bundle1
  next();
});

bundle.useAfter('bundle1', function (req, res, next) {
  // executes after bundle1
  next();
});

app.use(bundle);

app.listen(3000, function () {
  
});
```

## API

### bundle.use([name, ] callback)

Declare middleware in the bundle.

* `name` - OPTIONAL - name of the middleware. Useful for hook into middleware chain
* `callback` - typical middleware callback to that takes 3 arguments: `req`, `res`, `next`

### bundle.useBefore(name, callback)

Hook a middleware before the named middleware

* `name` - the name of the middleware to hook before
* `callback` - typical middleware callback to that takes 3 arguments: `req`, `res`, `next`

### bundle.useAfter(name, callback)

Hook a middleware after the named middleware

* `name` - the name of the middleware to hook after
* `callback` - typical middleware callback to that takes 3 arguments: `req`, `res`, `next`

## Run Tests

```
npm install
npm test
```