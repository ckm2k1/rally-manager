'use strict';
let StoriesCol = require('../collections').Stories;
let View = require('./view');

class Stories extends View {
  get collection() {
    return StoriesCol;
  }
}

module.exports = Stories;