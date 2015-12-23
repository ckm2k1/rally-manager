var BaseModel = require('./base');

class Story extends BaseModel {
  get defaults() {
    return {
      prop1: 'blah'
    };
  }

  constructor(attrs, options) {
    super(attrs, options);
  }

  toString() {
    let m = this.toJSON();

    let fmt = `
ID: ${m.FormattedID.title.underline}
Title: ${m.Name}
Blocked: ${m.Blocked.toString().warn.inverse}
Schedule State: ${m.ScheduleState}
Owner: ${m.Owner.Name}
Tasks Count: ${m.Tasks.Count}
Discussion: ${m.Discussion.Count}
Accepted Date: ${m.AcceptedDate}
Iteration: ${m.Iteration.Name}
Release: ${m.Release}`;

    return fmt;
  }

  parse(json) {
    json.Owner.Name = json.Owner._refObjectName;
    return json;
  }

  actionShowTasks() {
    var url = this.attrs.Tasks._ref;
    console.log(url);
  }

  actionDelete() {}

  actionUpdate() {}

  actionAdd() {}
}

Story.fields = ['Tasks', 'Discussion', 'AcceptedDate', 'BlockedReason', 'Iteration', 'Release'];

module.exports = Story;