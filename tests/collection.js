'use strict';
var Collection = require('../lib/collections/collection');
var Base = require('../lib/models/base');

describe('Collection', function () {

  it('should accept an array of json models and instanciate them', function () {
    let models = [{a: 'abc'}, {a: 123}, {a: 'xyz'}];
    let c = new Collection(models);

    expect(c).to.have.length(3);
    c.forEach((m, index) => {
      expect(m).to.be.instanceof(Base);
      expect(m.toJSON()).to.deep.equal(models[index]);
    });
  });

  it('should accept live model instances', function () {
    let models = [new Base({a: 'abc'}), new Base({a: 123})];
    let c = new Collection(models);

    expect(c).to.have.length(2);
    c.forEach((m, index) => {
      expect(m).to.be.instanceof(Base);
      expect(m.toJSON()).to.deep.equal(models[index].toJSON());
    });
  });

  it('should serialize the models', function () {
    let models = [{a: 'abc'}, {a: 123}, {a: 'xyz'}];
    let c = new Collection(models);

    expect(c.toJSON()).to.deep.equal(models);
  });

  it('should return it\'s type name', function () {
    let c = new Collection();
    expect(c.typeName).to.equal('Collection');
  });

});