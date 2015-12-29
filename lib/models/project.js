'use strict';
var BaseModel = require('./base');

class Project extends BaseModel {
  static get queryParams() {
    return {
      limit: 1,
      fetch: [
        'FormattedID',
        'Name'
      ],
      type: 'project'
    };
  }
}

module.exports = Project;