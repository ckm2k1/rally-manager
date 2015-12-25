'use strict';
let BaseModel = require('./base');

class Task extends BaseModel {
  isBlocked() {
    return !!this.attrs.Blocked;
  }

  isComplete() {
    return this.attrs.ToDo === 0;
  }

  // parse(json) {
  //   if (typeof json.WorkProduct === 'object')
  //     json.WorkProduct = `${json.WorkProduct.FormattedID} - ${json.WorkProduct.Name}`;
  //   return json;
  // }

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
        'Blocked'
      ],
      type: 'task'
    };
  }
}

module.exports = Task;