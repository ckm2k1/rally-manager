'use strict';
let BaseModel = require('./base');

class Task extends BaseModel {
  isBlocked() {
    return !!this.attrs.Blocked;
  }

  isComplete() {
    return this.attrs.ToDo === 0;
  }

  toJSON() {
    return Object.assign({}, this.attrs);
  }

  static get queryParams() {
    return {
      limit: 200,
      fetch: [
        'FormattedID',
        'Name',
        'Description',
        'State',
        'Estimate',
        'ToDo',
        'TimeSpent',
        'Blocked'
      ],
      type: 'task'
    };
  }
}

module.exports = Task;