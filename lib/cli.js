'use strict';
let program = require('commander');
let inquirer = require('inquirer');
let Api = require('./api');
let colors = require('colors');
let views = require('./views');
let config = new(require('./config'))();
let refCache = new(require('./refCache'))();
let util = require('./util');

// config.project = 48866461977; //14295351386 Desktop
config.project = 40910927478; //14295351386 Desktop
config.workspace = 14295351296;

const DEBUG = process.env.DEBUG === 'true';

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

function update(keyword, data) {
  if (!keyword || data.length < 2) program.help();

  let p = Promise.resolve();

  let _update = (model) => {
    return api.updateModel(model, data)
      .then(model => {
        refCache.set(keyword, model);
        renderHeader();
        new views[`${model.modelType}s`](model).render();
      })
      .catch(e => {
        console.log(e.stack);
        console.log(e.message.red);
      });
  };

  if (refCache.has(keyword)) {
    let model = refCache.get(keyword);
    return p.then(_update.bind(null, model));
  } else {
    return p
      .then(api.search.bind(api, keyword))
      .then((collection) => {
        if (collection.length > 1) {
          new views[collection.modelType](collection.toJSON()).render();
          throw new Error(`Need more specific ${collection.modelType} id`.red);
        }
        return collection.pop();
      })
      .then(_update)
      .catch((e) => {
        if (DEBUG) console.log(e.stack);
        console.log(e.message.red);
      });
  }
}

function search(term) {
  return api.search(term)
    .then(collection => {
      console.log(JSON.stringify(collection, null, 4));
      renderHeader();
      new views[collection.modelType](collection.toJSON()).render();
    })
    .catch((e) => {
      if (DEBUG) console.log(e.stack);
      console.log(e.message.red);
    });
}

function tasks() {
  return api.getCurrentIteration()
    .then(api.getTasks.bind(api, config.username))
    .then((tasks) => {
      renderHeader();
      new views.Tasks(tasks).render();
    })
    .catch(e => {
      console.log(e.stack);
      console.log(e);
    });
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
}