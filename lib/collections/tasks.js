'use strict';
let Task = require('../models').Task;
var Collection = require('./collection');

class Tasks extends Collection {
  constructor(models, options = { model: Task }) {
    super(models, options);
  }
}

module.exports = Tasks;