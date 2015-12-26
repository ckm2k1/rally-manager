'use strict';

class NotImplemented extends Error {
  constructor(msg) {
    super(`Method ${msg} is not implemented!`);
  }
}

class Base {
  constructor(attrs = {}, options = {parse: true}) {
    if (this.defaults) attrs = Object.assign({}, this.defaults, attrs);

    this.attrs = options.parse ? this.parse(attrs) : attrs;

    // Make the static queryParams available on the instance as well.
    this.queryParams = Object.assign({}, this.constructor.queryParams);
  }

  get(key) {
    return this.attrs[key];
  }

  set(key, val) {
    if (typeof key === 'object') {
      Object.assign(this.attrs, key);
    } else {
      this.attrs[key] = val;
    }

    return this;
  }

  get modelType() {
    return this.constructor.name;
  }

  toJSON() {
    return Object.assign({}, this.attrs);
  }

  parse(json) {
    return json;
  }

  static get collectionName() {
    return `${this.name}s`;
  }

  static get queryParams() {
    return {
      limit: 50,
      fetch: [
        'FormattedID',
        'Name'
      ],
      type: 'task'
    };
  }

}

module.exports = Base;