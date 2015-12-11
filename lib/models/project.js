'use strict';

var Backbone = require('backbone');

let Project = Backbone.Model.extend({
  // defaults: {
  //   name: '',
  //   uuid: '',
  //   _ref: ''
  // },

  parse: function(model) {
    return {
      name: model._refObjectName,
      uuid: model._refObjectUUID,
      _ref: model._ref,
      sprints: model.Iterations,
      id: model.ObjectID
    };
  }
});

module.exports = Project;