'use strict';

let models = {
  Defect: require('./defect'),
  Story: require('./story'),
  Epic: require('./epic'),
  Task: require('./task'),
  Query: require('./query'),
  Project: require('./project'),
  Iteration: require('./iteration'),

  getByType(type) {
    let regexMap = new Map([
      [/DE\d+/i, this.Defect],
      [/TA\d+/i, this.Task],
      [/US\d+/i, this.Story]
    ]);

    for (let [regex, model] of regexMap.entries()) {
      if (regex.test(type)) return model;
    }

    return false;
  }
};

module.exports = models;