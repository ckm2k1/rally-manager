/*jshint expr:true*/
'use strict';
let Model = require('../lib/models/base');
let util = require('util');

describe('Model', function() {
  function getModel(...args) {
    let child = class Child extends Model {};
    return new child(...args);
  }

  it('should apply defaults', function() {
    let child = class extends Model {
      get defaults() {
        return {
          a: 'abc',
          b: 123
        };
      }
    };

    let c = new child({
      a: 'xyz'
    });

    expect(c.get('a')).to.equal('xyz');
    expect(c.get('b')).to.equal(123);
  });

  it('should apply the parse function based on options', function() {
    let child = class extends Model {
      parse(attrs) {
        attrs.computed = attrs.a + attrs.b;
        return attrs;
      }
    };

    let m = new child({a: 'abc', b: 'xyz'});

    expect(m.get('computed')).to.equal('abcxyz');
  });

  it('should have queryParams on the instance as well as the Model', function () {
    let m = getModel();

    expect(Model).to.have.property('queryParams');
    expect(m).to.have.property('queryParams');
    expect(m.queryParams).to.deep.equal(Model.queryParams);
  });

  it('should respond with the model type of the inherited class', function () {
    let m = getModel();

    expect(m.modelType).to.equal('Child');
  });

  it('should set a single attribute', function () {
    let m = getModel({a: 'abc'});
    m.set('a', 'xyz');

    expect(m.get('a')).to.equal('xyz');
  });

  it('should set multiple attributes', function () {
    let m = getModel({a: 'abc', b: 'xyz'});
    m.set({a: 'xyz', b: 'def', c: 123});

    expect(m.get('a')).to.equal('xyz');
    expect(m.get('b')).to.equal('def');
    expect(m.get('c')).to.equal(123);
  });

  it('should return it\'s collection name', function () {
    class Story extends Model {}
    expect(Story.collectionName).to.equal('Stories');
  });

  it('should return an object with the attributes', function () {
    let attrs = {a: 'abc', b: 123, c: false};
    let m = new Model(attrs);

    expect(m.toJSON()).to.deep.equal(attrs);
  });

});