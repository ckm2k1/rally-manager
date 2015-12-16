let Backbone = require('backbone');
let util = require('util');

let Defect = Backbone.Model.extend({

  toString: function() {
    let m = this.toJSON();

    var fmt = `
      Id: ${m.FormattedID}
      Title: ${m.Name}
      Blocked: ${m.Blocked}
      Schedule State: ${m.ScheduleState}
      Owner: ${m.Owner._refObjectName}
      Tasks Count: ${m.Tasks.Count}
      Accepted Date: ${m.AcceptedDate}
      Iteration: ${m.Iteration.Name}
      Release: ${m.Release}`;

    return fmt;
  }
});

module.exports = Defect;