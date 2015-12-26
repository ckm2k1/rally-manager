'use strict';
let BaseModel = require('./base');

class Story extends BaseModel {
  isBlocked() {
    return !!this.get('Blocked');
  }

  static get queryParams() {
    return {
      limit: 100,
      fetch: [
        'FormattedID',
        'Name',
        'Tasks',
        'Discussion',
        'AcceptedDate',
        'Blocked',
        'BlockedReason',
        'Iteration',
        'Release'
      ],
      type: 'hierarchicalrequirement'
    };
  }

}

module.exports = Story;