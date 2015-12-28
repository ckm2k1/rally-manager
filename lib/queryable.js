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

  read() {}
  del() {}
  create() {}

  _resetSpinner() {
    spinner.stop();
    rl.clearLine(process.stdout, 0);
    rl.cursorTo(process.stdout, 0);
  }

  _getAccessor(isSingle) {
    return util.object.accessor(isSingle ? 'Results' : 'Object');
  }

  _exec(method, args, isSingle = false) {
    spinner.start();
    return this._api[method](args)
      .then(this._getAccessor(isSingle))
      .then((data) => {
        this._resetSpinner();
        return data;
      })
      .catch(util.identity);
  }

  getQueryParams() {
    return this.toJSON();
  }

  query(...args) {
    return this._exec('query', ...args, true);
  }

  getSingle() {
    let params = this.getQueryParams();
    return this._exec('query', params);
  }
}

module.exports = Queryable;