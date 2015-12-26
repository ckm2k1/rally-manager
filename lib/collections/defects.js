'use strict';
let Defect = require('../models').Defect;
var Collection = require('./collection');

class Defects extends Collection {
  constructor(models, options = { model: Defect }) {
    // options.model = Task;
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

module.exports = Defects;