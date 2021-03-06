'use strict';
let DefectCol = require('../collections').Defects;
let View = require('./view');

class Defects extends View {
  get collection() {
    return DefectCol;
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
    if (attrs.Release) {
      attrs.Release = `${attrs.Release.Name}`;
    }
    if (attrs.SubmittedBy) {
      attrs.SubmittedBy = `${attrs.SubmittedBy._refObjectName}`;
    }
    if (attrs.Owner) {
      attrs.Owner = `${attrs.Owner._refObjectName}`;
    }

    return attrs;
  }
}

module.exports = Defects;