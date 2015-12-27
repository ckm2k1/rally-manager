'use strict';
let User = require('../models').User;
var Collection = require('./collection');

class Users extends Collection {
  constructor(models, options = { model: User }) {
    super(models, options);
  }
}

module.exports = Users;