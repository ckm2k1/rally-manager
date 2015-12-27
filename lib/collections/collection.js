'use strict';
let Base = require('../models').Base;

class Collection extends Array {
  constructor(models, options) {
    super();

    this.modelClass = options.model || Base;

    models.forEach(model => {
      let task = model instanceof this.modelClass ?
        model :
        new this.modelClass(model, {
          parse: options.parse
        });

      this.push(task);
    });
  }

  toJSON() {
    return this.map(model => {
      return model.toJSON();
    });
  }

  getBlocked() {
    return this.filter(m => {
      return m.isBlocked();
    });
  }

  getComplete() {
    return this.filter(m => {
      return m.isComplete();
    });
  }

  get typeName() {
    return this.constructor.name;
  }
}

module.exports = Collection;