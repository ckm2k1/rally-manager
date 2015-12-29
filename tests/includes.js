'use strict';
global.chai = require('chai');
global.chaiSinon = require('sinon-chai');
global.expect = chai.expect;
global.chai.use(chaiSinon);

function inherit(superConstructor, ...protos) {
    function S(...args) {
      return Reflect.construct(superConstructor, args, new.target);
    }

    protos.forEach((proto) => {
      Object.setPrototypeOf(proto, superConstructor.prototype)
      Object.assign(S.prototype, proto);
    });
    Object.setPrototypeOf(S.prototype, superConstructor.prototype);
    Object.setPrototypeOf(S, superConstructor);

    class Child extends S {};
    return Child;
  }