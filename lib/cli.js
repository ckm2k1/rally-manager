'use strict';

let rally = require('rally');
let models = require('./models');
let collections = require('./collections');
var Spinner = require('cli-spinner').Spinner;
var commander = require('commander');
var inquirer = require('inquirer');
var _ = require('underscore');


let restApi = rally({
  user: 'stanislav_venzerul@mcafee.com', //required if no api key, defaults to process.env.RALLY_USERNAME
  pass: 'zYib#IWc7&mL3jcL', //required if no api key, defaults to process.env.RALLY_PASSWORD
  // apiKey: '_12fj83fjk...', //preferred, required if no user/pass, defaults to process.env.RALLY_API_KEY
  apiVersion: 'v2.0', //this is the default and may be omitted
  server: 'https://rally1.rallydev.com', //this is the default and may be omitted
  // requestOptions: {
  //   headers: {
  //     'X-RallyIntegrationName': 'Rally Manager', //while optional, it is good practice to
  //     'X-RallyIntegrationVendor': 'SinDesign Inc', //provide this header information
  //     'X-RallyIntegrationVersion': '1.0'
  //   }
  //   //any additional request options (proxy options, timeouts, etc.)
  // }
});

var Backbone = require('backbone');
let spinner = new Spinner('fetching... %s');
// spinner.setSpinnerString(3)
let origSync = Backbone.sync;

function stopSpinner(fn) {
  spinner.stop();
  return function(...rest) {
    return fn(...rest);
  };
}
Backbone.sync = function(method, model, options) {
  spinner.start();
  options.success = stopSpinner(options.success);
  options.error = stopSpinner(options.error);
  origSync.call(Backbone, method, model, options);
};

// let q = new models.Query({
//   api: restApi,
//   workspace: '14295351296',
//   project: '14295351386'
// });

// q.sync();

var ps = new collections.Projects({
  api: restApi,
  // id: '14295351386',
  workspaceId: '14295351296',
  spinner: spinner
});

ps.fetch({
  success: function(response) {
    console.log(ps.toJSON());
    var names = ps.map(function(model) {
      return {
        name: model.get('name'),
        value: model.get('id')
      };
    });
    inquirer.prompt([{
      type: 'list',
      name: 'Project List',
      message: 'Select a project:',
      choices: names
    }], function(answer) {
      console.log(answer);
    });
  },
  error: function(collection, resp, options) {
    console.log("\n");
    console.log(resp);
  }
});
// .then(function(result) {
//   console.log(arguments);
// })
// .catch(function() {
//   console.log(arguments);
// });

// console.log(ps.toJSON());