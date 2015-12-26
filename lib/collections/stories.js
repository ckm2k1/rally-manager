'use strict';
let Story = require('../models').Story;
var Collection = require('./collection');

class Stories extends Collection {
  constructor(models, options = { model: Story }) {
    super(models, options);
  }

  get modelType() {
    return 'Stories';
  }
}

module.exports = Stories;