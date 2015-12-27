'use strict';

let typeMap = {
  HierarchicalRequirement: 'Story',
  Defect: 'Defect',
  Task: 'Task',
  User: 'User'
};

let models = {
  Defect: require('./defect'),
  Story: require('./story'),
  Epic: require('./epic'),
  Task: require('./task'),
  Query: require('./query'),
  Project: require('./project'),
  Iteration: require('./iteration'),
  User: require('./user'),
  Base: require('./base'),

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
  },

  mapType(type) {
    return typeMap[type];
  }
};

module.exports = models;