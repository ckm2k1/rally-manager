'use strict';

class Base {
  constructor(attrs) {
    this.attrs = attrs;

    this.queryParams = this.constructor.queryParams;
  }

  get(key) {
    return this.attrs[key];
  }

  set(key, val) {
    this.attrs[key] = val;
    return this;
  }

  toJSON() {
    return Object.assign({}, this.attrs);
  }

}

module.exports = Base;