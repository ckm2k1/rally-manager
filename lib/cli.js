'use strict';

let models = require('./models');
let collections = require('./collections');
let commander = require('commander');
let inquirer = require('inquirer');
let _ = require('underscore');
var Api = require('./api');

var api = new Api({
  user: 'stanislav_venzerul@mcafee.com',
  pass: 'zYib#IWc7&mL3jcL'
});

api.search('US20253')
  .then((results) => {
    console.log(results);
  })
  .catch((e) => {
    console.log(e);
  });

// ps.fetch()
//   .then(function(response) {
//     let names = ps.map(function(model) {
//       return {
//         name: model.get('name'),
//         value: model.get('id')
//       };
//     });
//     inquirer.prompt([{
//       type: 'list',
//       name: 'project',
//       message: 'Select a project:',
//       choices: names
//     }], function(answer) {
//       let q = new models.Query({
//         type: 'defect'
//       }, {
//         api: restApi,
//         project: answer.project.toString(),
//       });
//       q.setQuery('FormattedID', '=', 'US20253');

//       return q.fetch();
//     });
//   })
//   .then(function(results) {
//     console.log(results);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });
