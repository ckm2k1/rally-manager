'use strict';
// let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let rl = require('readline');
let util = require('./util');

const spinner = new Spinner('fetching... %s');

class Queryable {
  constructor() {}

  update(...args) {
    return this._exec('update', ...args, true);
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
        console.log(arguments);
        this._resetSpinner();
        return data;
      })
      .catch(util.identity);
  }

  getQueryParams() {
    return this.toJSON();
  }

  query(...args) {
    // let params = this.getQueryParams();
    return this._exec('query', ...args);
  }

  getSingle() {
    let params = this.getQueryParams();
    return this._exec('query', params);
  }
}

module.exports = Queryable;