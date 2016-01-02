'use strict';
let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let rl = require('readline');
let util = require('./util');
const spinner = new Spinner('fetching... %s');

class Queryable {
  constructor(options = {
    user: '',
    pass: '',
    config: null,
    refCache: null
  }) {
    this.project = options.config.project;
    this.config = options.config;

    this._api = rally({
      user: options.user,
      pass: options.pass,
      apiVersion: 'v2.0',
      server: 'https://rally1.rallydev.com'
    });
  }

  update(...args) {
    return this._exec('update', ...args);
  }

  read(...args) {
    return this._exec('get', ...args);
  }

  del(...args) {
    return this._exec('del', ...args);
  }

  create(...args) {
    return this._exec('create', ...args);
  }

  query(...args) {
    return this._exec('query', ...args, {getCollection: true});
  }

  _resetSpinner() {
    spinner.stop();
    rl.clearLine(process.stdout, 0);
    rl.cursorTo(process.stdout, 0);
  }

  _getAccessor(isCollection) {
    return util.object.accessor(isCollection ? 'Results' : 'Object');
  }

  _exec(method, args, config = {}) {
    spinner.start();
    return this._api[method](args)
      .then(this._getAccessor(config.getCollection))
      .then((data) => {
        this._resetSpinner();
        return data;
      })
      .catch(util.identity);
  }
}

module.exports = Queryable;