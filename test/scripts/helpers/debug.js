'use strict';

var should = require('chai').should(); // eslint-disable-line
var rewire = require('rewire');
var sinon = require('sinon');

describe('debug', function() {
  var debug = require('../../../lib/plugins/helper/debug');
  var debugModule = rewire('../../../lib/plugins/helper/debug');
  var inspect = require('util').inspect;

  it('inspect simple object', function() {
    var obj = { foo: 'bar' };
    debug.inspectObject(obj).should.eql(inspect(obj));
  });

  it('inspect circular object', function() {
    var obj = { foo: 'bar' };
    obj.circular = obj;
    debug.inspectObject(obj).should.eql(inspect(obj));
  });

  it('inspect deep object', function() {
    var obj = { baz: { thud: 'narf', dur: { foo: 'bar', baz: { bang: 'zoom' } } } };
    debug.inspectObject(obj).should.not.eql(inspect(obj, {depth: 5}));
    debug.inspectObject(obj, {depth: 5}).should.eql(inspect(obj, {depth: 5}));
  });

  it('log should print to console', function() {
    var spy = sinon.spy();

    debugModule.__with__({
      console: {
        log: spy
      }
    })(function() {
      debugModule.log('Hello %s from debug.log()!', 'World');
    });

    spy.args[0].should.eql(['Hello %s from debug.log()!', 'World']);
  });
});
