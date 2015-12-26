'use strict';
let Task = require('../models').Task;
var Collection = require('./collection');

class Tasks extends Collection {
  constructor(models, options = { model: Task }) {
    super(models, options);
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

}

module.exports = Tasks;