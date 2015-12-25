'use strict';
let Task = require('../models').Task;

class Tasks extends Array {
  constructor(models) {
    super();

    this.modelClass = Task;


    models.forEach(model => {
      let task = model instanceof Task ? model : new Task(model);
      this.push(task);
    });
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

  toJSON() {
    return this.map(model => {
      return model.toJSON();
    });
  }
}

module.exports = Tasks;