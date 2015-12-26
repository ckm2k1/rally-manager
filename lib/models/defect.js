'use strict';
var BaseModel = require('./base');

class Defect extends BaseModel {
  isBlocked() {
    return !!this.get('Blocked');
  }

  isComplete() {
    return this.get('ToDo') === 0;
  }

  static get queryParams() {
    return {
      limit: 200,
      fetch: [
        'FormattedID',
        'Name',
        'Tasks',
        'Blocked',
        'BlockedReason',
        'Discussion',
        'AcceptedDate',
        'Iteration',
        'Release',
        'Environment',
        'OpenedDate',
        'Resolution',
        'Severity',
        'State',
        'SubmittedBy',
        'FoundInBuild',
        'c_Component',
        'c_Creator',
        'c_Stepstoreproduce'
      ],
      type: 'defect'
    };
  }
}

module.exports = Defect;