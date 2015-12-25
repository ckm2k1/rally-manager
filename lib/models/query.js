'use strict';

let Backbone = require('backbone');
let rally = require('rally');
let queryUtils = rally.util.query;
let BaseModel = require('./base');

let Query = Backbone.Model.extend({
  defaults: {
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
  },

  initialize: function(attributes, options = {
    fields: []
  }) {
    this.set('scope', {
      project: `/project/${options.project}`,
      up: false,
      down: true
    });

    // this.set('fetch', this.get('fetch').concat(options.fields));

    return this;
  },

  setQuery: function(lval, op, rval) {
    this.set('query', queryUtils.where(lval, op, rval));
    return this;
  },

  and: function(lval, op, rval) {
    this.set('query', this.get('query').and(lval, op, rval));
    return this;
  },

  or: function(lval, op, rval) {
    this.set('query', this.get('query').or(lval, op, rval));
    return this;
  }

});

module.exports = Query;