'use strict';
let StoriesCol = require('../collections').Stories;
let View = require('./view');

class Tasks extends View {
  get collection() {
    return StoriesCol;
  }
}

module.exports = Tasks;