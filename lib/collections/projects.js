'use strict';
let Project = require('../models').Project;
var Collection = require('./collection');

class Projects extends Collection {
  constructor(models, options = { model: Project }) {
    super(models, options);
  }
}

module.exports = Projects;