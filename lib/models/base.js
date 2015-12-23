'use strict';

class Base {
  constructor(attrs, options = {parse: true}) {
    this.attrs = options.parse ? this.parse(attrs) : attrs;

    // Make the static queryParams available on the instance as well.
    this.queryParams = Object.assign({}, this.constructor.queryParams);
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

  parse(json) {
    return json;
  }

}

module.exports = Base;