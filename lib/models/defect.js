var BaseModel = require('./base');

class Defect extends BaseModel {
  constructor() {
    super();
    this.fields = ['Tasks', 'Discussion', 'AcceptedDate', 'BlockedReason', 'Iteration', 'Release'];
  }

  toString() {
    let m = this.toJSON();

    let fmt = `
      Id: ${m.FormattedID}
      Title: ${m.Name}
      Blocked: ${m.Blocked}
      Schedule State: ${m.ScheduleState}
      Owner: ${m.Owner._refObjectName}
      Tasks Count: ${m.Tasks.Count}
      Accepted Date: ${m.AcceptedDate}
      Iteration: ${m.Iteration.Name}
      Release: ${m.Release}
    `;

    return fmt;
  }
}

module.exports = Defect;