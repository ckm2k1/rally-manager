'use strict';
let DefectCol = require('../collections').Defects;

class Defects {
  get collection() {
    return DefectCol;
  }
}

module.exports = Defects;