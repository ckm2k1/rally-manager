'use strict';
let rally = require('rally');
let queryUtils = rally.util.query;
let BaseModel = require('./base');

class Query extends BaseModel {
  constructor(attrs, options = {}) {
    super(attrs, options);

    if (options.project) {
      this.set('scope', {
        project: `/project/${options.project}`,
        up: false,
        down: true
      });
    }

    return this;
  }

  get defaults() {
    return {
      query: '',
      order: '', //how to sort the results
      pageSize: 200, //the page size (1-200, defaults to 200)
      start: 1, //the 1-based start index, defaults to 1
      fetch: ['FormattedID', 'Name', 'ScheduleState', 'Children', 'Owner'], //the fields to retrieve
      type: 'hierarchicalrequirement', //the type to query
      limit: 10, //the maximum number of results to return- enables auto paging
      scope: {
        project: '/project/%s', //specify to query a specific project
        up: false, //true to include parent project results, false otherwise
        down: true //true to include child project results, false otherwise
      },
      requestOptions: {} //optional additional options to pass through to request
    };
  }

  setQuery(lval, op, rval) {
    this.set('query', queryUtils.where(lval, op, rval));
    return this;
  }

  and(lval, op, rval) {
    this.set('query', this.get('query').and(lval, op, rval));
    return this;
  }

  or(lval, op, rval) {
    this.set('query', this.get('query').or(lval, op, rval));
    return this;
  }

  toJSON() {
    let attrs = super.toJSON();
    if (attrs.scope.project === '/project/%s') delete attrs.scope;
    return attrs;
  }

}

module.exports = Query;