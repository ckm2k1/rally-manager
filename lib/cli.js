'use strict';
let program = require('commander');
let inquirer = require('inquirer');
let Api = require('./api');
let colors = require('colors');

colors.setTheme({
  title: 'green',
  info: 'blue',
  warn: 'yellow',
  error: 'red',
  debug: 'grey'
});


let api = new Api({
  user: 'stanislav_venzerul@mcafee.com',
  pass: 'zYib#IWc7&mL3jcL'
});



program
  .version('0.0.1')
  .option('-s, --search [keywords]', 'Search for defects, tasks or stories')
  .parse(process.argv);



if (program.search) {
  api.search(program.search)
    .then(model => {
      console.log(model.toString());
    })
    .catch((e) => {
      console.log(e);
    });
}



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
//       api.search('US20253')
//         .then((results) => {
//           console.log(results);
//         })
//         .catch((e) => {
//           console.log(e);
//         });
//     });
//   })
//   .then(function(results) {
//     console.log(results);
//   })
//   .catch(function(error) {
//     console.log(error);
//   });