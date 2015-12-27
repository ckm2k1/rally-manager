'use strict';
let BaseModel = require('./base');

class Task extends BaseModel {
  isBlocked() {
    return !!this.get('Blocked');
  }

  isComplete() {
    return this.attrs.ToDo === 0;
  }

  static get queryParams() {
    return {
      limit: 200,
      fetch: [
        'FormattedID',
        'Name',
        'WorkProduct',
        'State',
        'Estimate',
        'ToDo',
        'TimeSpent',
        'Blocked',
        'BlockedReason'
      ],
      type: 'task'
    };
  }
}

module.exports = Task;