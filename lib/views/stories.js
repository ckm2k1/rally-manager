'use strict';
let StoriesCol = require('../collections').Stories;
let View = require('./view');

class Stories extends View {
  get collection() {
    return StoriesCol;
  }

  transform(attrs) {
    if (attrs.Tasks) {
      attrs.Tasks = `${attrs.Tasks.Count}`;
    }
    if (attrs.Discussion) {
      attrs.Discussion = `${attrs.Discussion.Count}`;
    }
    if (attrs.Iteration) {
      attrs.Iteration = `${attrs.Iteration.Name}`;
    }
    if (attrs.SubmittedBy) {
      attrs.SubmittedBy = `${attrs.SubmittedBy._refObjectName}`;
    }

    return attrs;
  }
}

module.exports = Stories;