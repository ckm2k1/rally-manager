'use strict';
let BaseModel = require('./base');
let rally = require('rally');
let Query = require('./query');

class Iteration extends BaseModel {

  constructor(attrs, config, options) {
    super(attrs || {}, options);
    this.config = config;
  }

  isOver() {
    let endDate = this.get('EndDate');
    if (!endDate) return true;
    return Date.now() >= (new Date(endDate)).getTime();
  }

  parse(attrs) {
    if (attrs.name && attrs.start) {
      attrs = {
        ref: attrs.ref,
        Name: attrs.name,
        StartDate: attrs.start,
        EndDate: attrs.end
      };
    }
    if (!attrs.ref) attrs.ref = rally.util.ref.getRelative(attrs._ref);
    return attrs;
  }

  persist() {
    this.config.iteration = {
      ref: this.get('ref'),
      start: this.get('StartDate'),
      end: this.get('EndDate'),
      name: this.get('Name')
    };
  }

  getQuery() {
    let q = new Query(this.queryParams, {
      project: this.config.project
    });

    let now = (new Date()).toISOString();
    q.setQuery('StartDate', '<=', now)
      .and('EndDate', '>=', now);

    return q;
  }

  static get queryParams() {
    return {
      limit: 1,
      fetch: [
        'Name',
        'StartDate',
        'EndDate'
      ],
      type: 'iteration'
    };
  }
}

module.exports = Iteration;