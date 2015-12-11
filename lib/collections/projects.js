'use strict';

let Backbone = require('backbone');
let models = require('../models');
var util = require('util');

let Projects = Backbone.Collection.extend({
  model: models.Project,
  url: '/workspace/%s/projects',

  defaultQueryParams: {
    order: '',
    pagesize: '20',
    start: '',
    fetch: ''
  },

  initialize: function(options) {
    this.api = options.api;
    this.id = options.workspaceId;
    this.spinner = options.spinner;
  },

  sync: function(method, model, options = {}) {
    let url = util.format(this.url, this.id);
    this.spinner.start();

    return this.api.get({ref: url})
      .then((resp) => {
        this.spinner.stop();
        options.success(resp);
      }, (resp) => {
        this.spinner.stop();
        options.error(resp);
      });
  },

  parse: function(response) {
    return response.Object.Results;
  }
});

module.exports = Projects;