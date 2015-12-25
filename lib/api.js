'use strict';
let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let models = require('./models');
let collections = require('./collections');
let rl = require('readline');
var util = require('./util');

class Api {
  constructor(options = {
    user: '',
    pass: '',
    config: null,
    refCache: null
  }) {

    this.project = options.config.project;
    this.config = options.config;
    this.refCache = options.refCache;

    this._api = rally({
      user: options.user,
      pass: options.pass,
      apiVersion: 'v2.0',
      server: 'https://rally1.rallydev.com'
    });

    this.spinner = new Spinner('fetching... %s');

    // rl.cursorTo(process.stdout, 0, 0);
    // rl.clearScreenDown(process.stdout);
  }

  _resetSpinner() {
    this.spinner.stop();
    rl.clearLine(process.stdout, 0);
    rl.cursorTo(process.stdout, 0);
    // console.log('\n');
  }

  _startSpinner() {
    // console.log('\n');
    this.spinner.start();
  }

  _execQuery(method = 'get', args = {}) {
    this._startSpinner();
    return Promise.resolve()
      .then(() => {
        return this._api[method](args)
          .then((results) => {
            this._resetSpinner();
            return results.Results || results.Object;
          })
          .catch((e) => {
            this._resetSpinner();
            return e;
          });
      });
  }

  search(keyword) {
    return Promise.resolve()
      .then(() => {
        let Model = models.getByType(keyword);
        if (!Model) throw new Error('Unrecognized search term');

        let q = new models.Query(Model.queryParams, {
          project: this.project
        });
        q.setQuery('FormattedID', 'contains', keyword);

        return this._execQuery('query', q.toJSON())
          .then(results => {
            if (results.length > 1) new collections.Results(results, {model: Model});
            else return new Model(results[0], {parse: true});
          });
      });
  }

  getCurrentIteration() {
    return Promise.resolve()
      .then(() => {
        let iteration = new models.Iteration(this.config.iteration, this.config);
        if (!iteration.isOver()) return iteration.get('ref');

        return this._execQuery('query', iteration.getQuery().toJSON())
          .then(([response]) => {
            iteration.set(iteration.parse(response));
            iteration.persist();
            return iteration.get('ref');
          });
      });
  }

  getTasks(owner, iterationRef) {
    return Promise.resolve()
      .then(() => {
        let q = new models.Query(models.Task.queryParams, {
          project: this.project
        });
        q.setQuery('iteration', '=', iterationRef)
          .and('Owner.Name', '=', owner);

        return this._execQuery('query', q.toJSON());
      });
  }

  _cacheSetter(keyword, model) {
    this.refCache.set(keyword, model);
    return model;
  }

  updateModel(keyword, data) {
    let p = Promise.resolve();

    let _update = (model) => {
      let ref = model.get('_ref');
      this._cacheSetter(keyword, model);

      return this._execQuery('update', {
        ref: rally.util.ref.getRelative(ref),
        data: util.object.pairs(data),
        fetch: model.queryParams.fetch
      });
    };

    if (this.refCache.has(keyword)) {
      let model = this.refCache.get(keyword);
      return p
        .then(_update.bind(null, model));
    } else {
      return p
        .then(this.search.bind(this, keyword))
        .then(_update);
    }
  }

}

module.exports = Api;