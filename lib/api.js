'use strict';
let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let models = require('./models');
let collections = require('./collections');

class Api {
  constructor(apiConfig = {
    user: '',
    pass: '',
    // apiKey: '_12fj83fjk...',
    apiVersion: 'v2.0',
    server: 'https://rally1.rallydev.com',
  }, options = {
    project: '14295351386',
    workspace: '14295351296'
  }) {
    this.currentProject = options.project;

    this._api = rally(apiConfig);
    this.spinner = new Spinner('fetching... %s');

    this.regexTypeMap = new Map([
      [/DE\d+/i, 'defect'],
      [/TA\d+/i, 'task'],
      [/US\d+/i, 'hierarchicalrequirement']
    ]);
  }

  _execQuery(method = 'get', args = {}) {
    this.spinner.start();
    return new Promise((resolve, reject) => {
      return this._api[method](args)
        .then((results) => {
          this.spinner.stop();
          resolve(results.Results);
        })
        .catch((e) => {
          this.spinner.stop();
          reject(e);
        });

    });
  }

  search(keywords) {
    return Promise.resolve()
      .then(() => {
        let objectType = this._findType(keywords);
        if (!objectType) throw new Error('Unrecognized keyword type');

        let q = new models.Query({
          type: this.findType
        }, {
          project: this.currentProject,
        });
        q.setQuery('FormattedID', 'contains', keywords);

        return this._execQuery('query', q.toJSON());
      });
  }

  _findType(str) {
    for (let re of this.regexTypeMap.entries()) {
      if (re[0].test(str)) return re[1];
    }

    return false;
  }



}

module.exports = Api;