'use strict';
let path = require('path');
var models = require('./models');
var util = require('./util');

let cacheFile = path.resolve(process.env.HOME, '.rally-ref-cache');

class RefCache extends Map {
  constructor() {
    super();

    util.fs.ensureFile(cacheFile);
    let map = util.fs.readFile(cacheFile);
    this.vivify(map ? JSON.parse(map) : {});

    return this;
  }

  vivify(json) {
    for(let [keyword, attrs] of util.object.entries(json)) {
      super.set(keyword, new models[attrs._type](attrs));
    }
  }

  save() {
    util.fs.writeJSON(cacheFile, this.toJSON());
    return this;
  }

  set(key, val) {
    super.set(key, val);
    this.save();
  }

  toJSON() {
    let entries = {};
    for(let [key, val] of this.entries()) {
      entries[key] = val.toJSON();
    }

    return entries;
  }

}

module.exports = RefCache;