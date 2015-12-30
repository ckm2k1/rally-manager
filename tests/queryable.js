'use strict';
let proxyquire = require('proxyquire');

function rally(options) {
  return {
    get: function() {
      return Promise.resolve();
    },
    query: function() {
      return Promise.resolve();
    },
    create: function() {
      return Promise.resolve();
    },
    del: function() {
      return Promise.resolve();
    }
  };
}


rally['@global'] = true;
let Queryable = proxyquire('../lib/queryable', {
  rally: rally,
  readline: {
    clearLine: function() {},
    cursorTo: function() {}
  },
  'cli-spinner': {
    Spinner: function() {
      this.start = sinon.stub();
      this.stop = sinon.stub();
    }
  }
  // './util': {
  //   object: {
  //     accessor: function() {}
  //   },
  //   identity: function() {}
  // }
});

describe('Queryable', function() {
  let options = {
    config: {
      project: 123123123
    }
  };

  it('should return a collection', function() {
    let q = new Queryable(options);
    let arr = [1, 2, 3];
    let obj = {a: 'abc'};
    expect(q._getAccessor(true)({
      Results: arr
    })).to.deep.equal(arr);

    expect(q._getAccessor()({'Object': obj})).to.deep.equal(obj);
  });

  it('should the correct method on _api', function () {
    let q = new Queryable(options);
    let out = [1,2,3];
    sinon.stub(q._api, 'get', function() {
      return Promise.resolve({
        Object: out
      });
    });

    return q.read({a: 'abc'})
      .then((results) => {
        expect(results).to.deep.equal(out);
      });
  });

  it('should return a collection on query', function () {
    let q = new Queryable(options);
    let out = [1,2,3];

    sinon.stub(q._api, 'query', function() {
      return Promise.resolve({
        Results: out
      });
    });

    return q.query({a: 'abc'})
      .then((results) => {
        expect(results).to.deep.equal(out);
      });
  });
});

