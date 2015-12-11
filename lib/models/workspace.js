'use strict';

let Backbone = require('backbone');
let collections = require('../collections');

let Workspace = Backbone.Collection.extend({
  model: models.Project,
  url: '/workspace/14295351296',

  initialize: function(options) {
    this.api = options.api;
    this.id = options.id;
  },

  sync: function(method, model, options = {}) {
    return this.api.get({
        'ref': this.url
      })
      .then(options.success, options.error);
  },

  // parse: function(response) {
  //   return response.Results;
  // }
});

module.exports = Workspace;