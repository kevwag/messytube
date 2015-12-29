var bundles = require('../');
var expect = require('chai').expect;
var request = require('supertest');
var connect = require('connect');

describe('bundling', function () {
  
  it('creates a stack of middleware in order', function (done) {
    
    var app = connect();
    var bundle = bundles();
    var bundle1called = false;
    var bundle2called = false;
    var callstack = [];
    
    bundle.use(function (req, res, next) {
      
      bundle1called = true;
      callstack.push(1);
      next();
    });
    bundle.use(function (req, res, next) {
      
      bundle2called = true;
      callstack.push(2);
      next();
    });
    app.use(bundle);
    
    expect(bundle._stack).to.have.length(2);
    
    request(app)
      .get('/')
      .expect(function () {
        
        expect(bundle1called).to.equal(true);
        expect(bundle2called).to.equal(true);
        expect(callstack).to.eql([1,2]);
      })
      .end(done);
  });
  
  it('names the bundle stack', function (done) {
    
    var app = connect();
    var bundle = bundles();
    var bundlecalled = false;
    
    bundle.use('bundle1', function (req, res, next) {
      
      bundlecalled = true;
      next();
    });
    app.use(bundle);
    
    expect(bundle._stack[0].name).to.equal('bundle1');
    
    request(app)
      .get('/')
      .expect(function () {
        
        expect(bundlecalled).to.equal(true);
      })
      .end(done);
  });
  
  it('is chainable', function () {
    
    var bundle = bundles();
    
    bundle
      .use(function () {})
      .use(function () {});
  });
});

describe('hooks', function () {
  
  it('creates blank before hook stacks on normal stack layer creation', function () {
    
    var bundle = bundles();
    bundle.use('bundle1', function () {});
    
    expect(bundle._before.bundle1).to.eql([]);
  });
  
  it('creates blank after hook stacks on normal stack layer creation', function () {
    
    var bundle = bundles();
    bundle.use('bundle1', function () {});
    
    expect(bundle._after.bundle1).to.eql([]);
  });
  
  it('chainable before hooks', function () {
    
    var bundle = bundles();
    bundle.use('bundle1', function () {});
    
    bundle
      .useBefore('bundle1', function () {})
      .useBefore('bundle1', function () {});
  });
  
  it('chainable after hooks', function () {
    
    var bundle = bundles();
    bundle.use('bundle1', function () {});
    
    bundle
      .useAfter('bundle1', function () {})
      .useAfter('bundle1', function () {});
  });
  
  it('execute a middleware hooked in before a named middleware', function (done) {
    
    var app = connect();
    var bundle = bundles();
    var prebundlecalled = false;
    var bundlecalled = false;
    var callstack = [];
    
    bundle.use('bundle1', function (req, res, next) {
      
      bundlecalled = true;
      callstack.push('bundle');
      next();
    });
    bundle.useBefore('bundle1', beforeBundle1);
    app.use(bundle);
    
    expect(bundle._before.bundle1[0].handler.toString()).to.equal(beforeBundle1.toString());
    
    request(app)
      .get('/')
      .expect(function () {
        expect(prebundlecalled).to.equal(true);
        expect(bundlecalled).to.equal(true);
        expect(callstack).to.eql(['pre bundle', 'bundle']);
      })
      .end(done);
    
    function beforeBundle1 (req, res, next) {
      
      prebundlecalled = true;
      callstack.push('pre bundle');
      next();
    }
  });
  
  it('execute a middleware hooked in after a named middleware', function (done) {
    
    var app = connect();
    var bundle = bundles();
    var postbundlecalled = false;
    var bundlecalled = false;
    var callstack = [];
    
    bundle.use('bundle1', function (req, res, next) {
      
      bundlecalled = true;
      callstack.push('bundle');
      next();
    });
    bundle.useAfter('bundle1', afterBundle1);
    app.use(bundle);
    
    expect(bundle._after.bundle1[0].handler.toString()).to.equal(afterBundle1.toString());
    
    request(app)
      .get('/')
      .expect(function () {
        expect(postbundlecalled).to.equal(true);
        expect(bundlecalled).to.equal(true);
        expect(callstack).to.eql(['bundle', 'after bundle']);
      })
      .end(done);
    
    function afterBundle1 (req, res, next) {
      
      postbundlecalled = true;
      callstack.push('after bundle');
      next();
    }
  });
});