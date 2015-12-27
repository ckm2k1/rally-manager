'use strict';
let program = require('commander');
let inquirer = require('inquirer');
let Api = require('./api');
let colors = require('colors');
let views = require('./views');
let config = new(require('./config'))();
let refCache = new(require('./refCache'))();
let util = require('./util');
let collections = require('./collections');

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

  if (!config.username)
    p = p.then(_promptCred.bind(null, 'username', 'Username'));
  if (!config.password)
    p = p.then(_promptCred.bind(null, 'password', 'Password', true));

  api = new Api({
    user: config.username,
    pass: config.password,
    config: config,
    refCache: refCache
  });

  p.then(api.getCurrentIteration.bind(api))
    .then(startCli);
}

function _promptCred(name, message, hide = false, type = 'input') {
  type = hide ? 'password' : type;

  return new Promise((resolve, reject) => {
    inquirer.prompt([{
      type: type,
      name: name,
      message: message
    }], (answer) => {
      config[name] = answer[name];
      resolve();
    });
  });
}

function update(artifact, data) {
  if (!artifact || data.length < 2) program.help();

  return Promise.resolve()
    .then(() => {
      if (refCache.has(artifact)) {
        let model = refCache.get(artifact);
        return model;
      } else return api.search(artifact);
    })
    .then((collection) => {
      if (collection.length > 1) {
        new views[collection.modelType](collection).render();
        throw new Error(`Need more specific ${collection.modelType} id`.red);
      }

      return api.updateModel(collection.pop(), data);
    })
    .then((model) => {
      refCache.set(artifact, model);
      renderHeader();
      new views[util.string.pluralize(model.modelType)](model).render();
    })
    .catch(util.printError);
}

function search(term) {
  return api.search(term)
    .then(collection => {
      // console.log(JSON.stringify(collection, null, 4));
      renderHeader();
      new views[collection.modelType](collection).render();
    })
    .catch(util.printError);
}

function getByModelType(type) {
  return api.getCurrentIteration()
    .then(api.getByModelType.bind(api, type, config.username))
    .then((models) => {
      renderHeader();
      new views[util.string.pluralize(type)](models).render();
    })
    .catch(util.printError);
}

function getUsers() {
  return Promise.resolve()
    .then(() => {
      let users = refCache.find(/\/user/);
      if (users.length) return new collections.Users(users);
      else return api.getUsers();
    })
    .then((collection) => {
      renderHeader();
      new views.Users(collection).render();
    })
    .catch(util.printError);
}

function renderHeader() {
  let header = `\n${config.iteration.name.inverse.green}\n`;
  console.log(header);
}

function startCli() {

  program
    .version('0.0.1');

  program
    .command('update <modelId> [data...]')
    .alias('u')
    .description('Update a task, defect or story')
    .action(update);

  program
    .command('tasks')
    .alias('ta')
    .description('display all my tasks in current iteration')
    .action(getByModelType.bind(null, 'Task'));

  program
    .command('stories')
    .alias('st')
    .description('display all my stories in current iteration')
    .action(getByModelType.bind(null, 'Story'));

  program
    .command('defects')
    .alias('de')
    .description('display all my defects in current iteration')
    .action(getByModelType.bind(null, 'Defect'));

  program
    .command('usr')
    .description('display all users')
    .action(getUsers);

  program
    .command('search <keyword>')
    .alias('s')
    .description('search for a task, defect or story by keyword, ex: TA1234')
    .action(search);

  program.parse(process.argv);
  if (process.argv.length < 3) program.help();
}