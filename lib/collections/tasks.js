var Task = require('../models').Task;

class Tasks extends Array {
  constructor(models) {
    super();

    models.forEach(model => {
      this.push(new Task(model));
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