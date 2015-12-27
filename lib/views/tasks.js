'use strict';
let TasksCol = require('../collections').Tasks;
let View = require('./view');

class Tasks extends View {
  get collection() {
    return TasksCol;
  }

  serializeData(attrs) {
    if (attrs.WorkProduct)
      attrs.WorkProduct = `${attrs.WorkProduct.FormattedID} - ${attrs.WorkProduct.Name}`;

    return attrs;
  }
}

module.exports = Tasks;