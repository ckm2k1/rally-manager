'use strict';
let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let models = require('./models');
let collections = require('./collections');
let rl = require('readline');

const REGEX = 0;
const DESC = 1;

class Api {
  constructor(apiConfig = {
    user: '',
    pass: '',
    // apiKey: '_12fj83fjk...',
    apiVersion: 'v2.0',
    server: 'https://rally1.rallydev.com',
  }, options = {
    project: null,
    workspace: null,
    config: null
  }) {
    this.currentProject = options.project;
    this.config = options.config;

    this._api = rally(apiConfig);
    this.spinner = new Spinner('fetching... %s');

    this.regexTypeMap = new Map([
      [/DE\d+/i, {type: 'defect', model: models.Defect}],
      [/TA\d+/i, {type: 'task', model: models.Task}],
      [/US\d+/i, {type: 'hierarchicalrequirement', model: models.Story}]
    ]);

    // rl.cursorTo(process.stdout, 0, 0);
    // rl.clearScreenDown(process.stdout);
  }

  _resetSpinner() {
    // this.spinner.stop();
    // rl.clearLine(process.stdout, 0);
    // rl.cursorTo(process.stdout, 0, 1);
  }

  _execQuery(method = 'get', args = {}) {
    // this.spinner.start();
    return Promise.resolve()
      .then(() => {
        return this._api[method](args)
          .then((results) => {
            this._resetSpinner();
            return results.Results;
          })
          .catch((e) => {
            this._resetSpinner();
            return e;
          });
      });
  }

  search(keywords) {
    return Promise.resolve()
      .then(() => {
        let descriptor = this._findType(keywords);
        if (!descriptor) throw new Error('Unrecognized keyword type');

        let attrs = {
          type: descriptor.type
        };

        let q = new models.Query(attrs, {
          project: this.currentProject,
          fields: descriptor.model.fields || []
        });
        q.setQuery('FormattedID', 'contains', keywords);

        return this._execQuery('query', q.toJSON())
          .then(results => {
            if (results.length > 1) new collections.Results(results, {model: descriptor.model});
            else return new (descriptor.model)(results[0], {parse: true});
          });
      });
  }

  getCurrentIteration() {
    if (this.config.iteration) return Promise.resolve(this.config.iteration);

    let q = new models.Query({
      type: 'iteration',
      fetch: ['StartDate', 'EndDate', 'Name'],
      limit: 1
    }, {
      project: this.currentProject
    });

    let now = (new Date()).toISOString();

    q.setQuery('StartDate', '<=', now)
      .and('EndDate', '>=', now);

    return this._execQuery('query', q.toJSON())
      .then(([iter]) => {
        let ref = rally.util.ref.getRelative(iter._ref);
        this.config.iteration = ref;
        return ref;
      });
  }

  getTasks(owner, iterationRef) {
    return Promise.resolve()
      .then(() => {
        let q = new models.Query(models.Task.queryParams, {
          project: this.currentProject
        });
        q.setQuery('iteration', '=', iterationRef)
          .and('Owner.Name', '=', owner);

        return this._execQuery('query', q.toJSON());
      });
  }

  _findType(str) {
    for (let re of this.regexTypeMap.entries()) {
      if (re[REGEX].test(str)) return re[DESC];
    }

    return false;
  }



}

module.exports = Api;