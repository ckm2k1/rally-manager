'use strict';
let Defect = require('../models').Defect;
var Collection = require('./collection');

class Defects extends Collection {
  constructor(models, options = { model: Defect }) {
    super(models, options);
  }
}

module.exports = Defects;