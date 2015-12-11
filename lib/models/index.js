'use strict';

let models = {
  Defect: require('./defect'),
  Story: require('./story'),
  Epic: require('./epic'),
  Task: require('./task'),
  Query: require('./query'),
  Project: require('./project'),
};

module.exports = models;