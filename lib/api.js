'use strict';
let rally = require('rally');
let Spinner = require('cli-spinner').Spinner;
let models = require('./models');
let collections = require('./collections');
let rl = require('readline');
let util = require('./util');

class NotFound extends Error {}

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
  }

  _resetSpinner() {
    this.spinner.stop();
    rl.clearLine(process.stdout, 0);
    rl.cursorTo(process.stdout, 0);
  }

  _startSpinner() {
    this.spinner.start();
  }

  _execQuery(method, args) {
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
            if (!results.length)
              throw new NotFound(`${keyword} not found.`);

            return new collections[`${Model.name}s`](results, {
              model: Model
            });
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

  updateModel(model, data) {
    let ref = model.get('_ref');
    return this._execQuery('update', {
      ref: rally.util.ref.getRelative(ref),
      data: util.object.pairs(data),
      fetch: model.queryParams.fetch
    })
    .then((updated) => {
      model.set(updated);
      return model;
    });
  }

}

module.exports = Api;