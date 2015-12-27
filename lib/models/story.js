'use strict';
let BaseModel = require('./base');
var util = require('../util');

class Story extends BaseModel {
  isBlocked() {
    return !!this.get('Blocked');
  }

  // parse(attrs) {
  //   attrs.Iteration = util.object.soak(attrs, 'Iteration.Name');
  //   attrs.Discussion = util.object.soak(attrs, 'Discussion.Count');
  //   attrs.Tasks = util.object.soak(attrs, 'Tasks.Count');
  //   return attrs;
  // }

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

  // Don't wanna write a pluralizer...
  static get collectionName() {
    return 'Stories';
  }

}

module.exports = Story;