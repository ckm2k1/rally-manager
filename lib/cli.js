'use strict';
let program = require('commander');
let inquirer = require('inquirer');
let Api = require('./api');
let colors = require('colors');
let collections = require('./collections');
let views = require('./views');
var config = new (require('./config'))();

config.project = 14295351386; //48866461977 Rocket
config.workspace = 14295351296;


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
}, {
  config: config,
  project: config.project,
  workspace: config.workspace
});



program
  .version('0.0.1')
  .option('-s, --search [keywords]', 'Search for defects, tasks or stories')
  .option('-t, --tasks', 'Show all current sprint tasks')
  .parse(process.argv);


if (program.search) {
  api.search(program.search)
    .then(model => {
      console.log(model.toString());
      let actions = model.getActions();
      actions.push({
        name: 'Quit',
        value: 'quit'
      });
      inquirer.prompt({
        type: 'list',
        name: 'nextAction',
        message: 'What would you like to do next',
        choices: actions
      }, function(answer) {
        if (answer.nextAction === 'quit') process.exit();
        model[answer.nextAction]();
      });
    })
    .catch((e) => {
      console.log(e.stack);
      console.log(e);
    });
}

if (program.tasks) {
  api.getCurrentIteration()
    .then(api.getTasks.bind(api, 'stanislav_venzerul@mcafee.com'))
    .then((tasks) => {
      tasks = new collections.Tasks(tasks);
      let view = new views.Tasks(tasks);
      view.render();
    })
    .catch(e => {
      console.log(e.stack);
      console.log(e);
    });
}