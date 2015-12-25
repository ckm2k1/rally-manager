'use strict';
let program = require('commander');
let inquirer = require('inquirer');
let Api = require('./api');
let colors = require('colors');
let collections = require('./collections');
let views = require('./views');
let config = new(require('./config'))();
let refCache = new(require('./refCache'))();

// config.project = 48866461977; //14295351386 Desktop
config.project = 40910927478; //14295351386 Desktop
config.workspace = 14295351296;


colors.setTheme({
  title: 'green',
  info: 'blue',
  warn: 'yellow',
  error: 'red',
  debug: 'grey'
});


let api;
ensureCredentials(config);

function ensureCredentials(config) {
  let p = Promise.resolve();

  if (!config.username) p = p.then(() => {
    return _promptCred('username', 'Username')
      .then((input) => {
        config.username = input.username;
      });
  });
  if (!config.password) p = p.then(() => {
    return _promptCred('password', 'Password', true)
      .then(input => {
        config.password = input.password;
      });
  });

  p.then(startCli);
}

function _promptCred(name, message, hide = false, type = 'input') {
  type = hide ? 'password' : type;

  return new Promise((resolve, reject) => {
    inquirer.prompt([{
      type: type,
      name: name,
      message: message
    }], resolve);
  });
}



function update(modelId, data) {
  if (!modelId || data.length < 2) program.help();

  api.updateModel(modelId, data)
    .then(model => {
      console.log(model);
    })
    .catch(e => {
      console.log(e.stack);
    });
}

function search(term) {
  return api.search(term)
    .then(model => {
      let tasks = new collections.Tasks([model]);
      let view = new views.Tasks(tasks);
      renderHeader();
      view.render();
    })
    .catch((e) => {
      console.log(e.stack);
      console.log(e);
    });
}

function tasks() {
  return api.getCurrentIteration()
    .then(api.getTasks.bind(api, 'stanislav_venzerul@mcafee.com'))
    .then((tasks) => {
      tasks = new collections.Tasks(tasks);
      let view = new views.Tasks(tasks);
      renderHeader();
      view.render();
    })
    .catch(e => {
      console.log(e.stack);
      console.log(e);
    });
}

function renderHeader() {
  let header = `\nCurrent Sprint: ${config.iteration.name.inverse.green}\n`;
  console.log(header);
}

function startCli() {
  api = new Api({
    user: config.username,
    pass: config.password,
    config: config,
    refCache: refCache
  });

  program
    .version('0.0.1');

  program
    .command('update <modelId> [data...]')
    .alias('u')
    .description('Update a task, defect or story')
    .action(update);

  program
    .command('tasks')
    .alias('t')
    .description('display all my tasks in current iteration')
    .action(tasks);

  program
    .command('search <keyword>')
    .alias('s')
    .description('search for a task, defect or story by keyword, ex: TA1234')
    .action(search);

  program.parse(process.argv);

  if (process.argv.length < 3) program.help();
  // if (program.search) search(program.search);
  // if (program.tasks) tasks(program.tasks);

}