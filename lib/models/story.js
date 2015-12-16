let Backbone = require('backbone');

let Story = Backbone.Model.extend({

  toString: function() {
    let m = this.toJSON();

    var fmt = `
      Id: ${m.FormattedID}
      Title: ${m.Name}
      Blocked: ${m.Blocked}
      Schedule State: ${m.ScheduleState}
      Owner: ${m.Owner._refObjectName}
      Tasks Count: ${m.Tasks.Count}
      Discussion: ${m.Discussion.Count}
      Accepted Date: ${m.AcceptedDate}
      Iteration: ${m.Iteration.Name}
      Release: ${m.Release}`;

    return fmt;
  }

  // parse: function(json) {
  //   this.set('Tasks');
  // }
}, {
  fields: ['Tasks', 'Discussion', 'AcceptedDate', 'BlockedReason', 'Iteration', 'Release']
});

module.exports = Story;