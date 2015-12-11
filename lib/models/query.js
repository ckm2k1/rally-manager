'use strict';

let Backbone = require('backbone');
let rally = require('rally');
let queryUtils = rally.util.query;



let Query = Backbone.Model.extend({
  defaults: {
    query: '',
    order: 'Rank', //how to sort the results
    pageSize: 2, //the page size (1-200, defaults to 200)
    start: 1, //the 1-based start index, defaults to 1
    fetch: ['FormattedID', 'Name', 'ScheduleState', 'Children'], //the fields to retrieve
    type: 'hierarchicalrequirement', //the type to query
    limit: 10, //the maximum number of results to return- enables auto paging
    scope: {
      workspace: '/workspace/1234', //specify to query entire workspace
      project: '/project/2345', //specify to query a specific project
      up: false, //true to include parent project results, false otherwise
      down: true //true to include child project results, false otherwise
    },
    requestOptions: {} //optional additional options to pass through to request
  },

  sync: function(method, model, options) {
    if (method === 'read') {
      return this.api.query(this.toJSON())
        .then(options.success, options.error)
        .catch(function(error) {
          console.log(error);
        });
    }

    return Backbone.sync.apply(this, arguments);
  },

  setQuery: function(lval, op, rval) {
    this.set('query', queryUtils.where(lval, op, rval));
  }
  // queryUtils.where('DirectChildrenCount', '>', 0), //optional filter
});

module.exports = Query;