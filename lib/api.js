'use strict';
let Queryable = require('./queryable');
let models = require('./models');
let collections = require('./collections');
let util = require('./util');
let rally = require('rally');

class NotFound extends Error {}

class Api extends Queryable{
  constructor(options) {
    super(options);
    this.refCache = options.refCache;
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

        return this.query(q.toJSON())
          .then(results => {
            if (!results.length)
              throw new NotFound(`${keyword} not found.`);

            return new collections[`${Model.collectionName}`](results, {
              model: Model,
              parse: true
            });
          });
      });
  }

  getCurrentIteration() {
    return Promise.resolve()
      .then(() => {
        let iteration = new models.Iteration(this.config.iteration, this.config);
        if (!iteration.isOver()) return iteration.get('ref');

        return this.query(iteration.getQuery().toJSON())
          .then(([response]) => {
            iteration.set(iteration.parse(response));
            iteration.persist();
            return iteration.get('ref');
          });
      });
  }

  getByModelType(modelType, owner, ref) {
    return Promise.resolve()
      .then(() => {
        let q = new models.Query(models[modelType].queryParams, {
          project: this.project
        });
        q.setQuery('iteration', '=', ref)
          .and('Owner.Name', '=', owner);

          // console.log(JSON.stringify(q, null, 4));
        return this.query(q.toJSON());
      });
  }

  getUsers() {
    return this.query({
      ref: '/users',
      type: 'users'
    })
    .then((users) => {
      let col = new collections.Users(users);

      col.forEach((user) => {
        let ref = rally.util.ref.getRelative(user.get('_ref'));
        this.refCache.set(ref, user.toJSON());
      });

      return col;
    });
  }

  updateModel(model, data) {
    let ref = model.get('_ref');
    return this.update({
      ref: rally.util.ref.getRelative(ref),
      data: util.object.pairs(data),
      fetch: model.queryParams.fetch
    })
    .then((updated) => {
      return model.set(updated);
    });
  }

}

module.exports = Api;