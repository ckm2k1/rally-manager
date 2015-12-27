'use strict';
let path = require('path');
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
      super.set(keyword, attrs);
    }
  }

  find(keyword) {
    let results = [];
    for(let key of this.keys()) {
      if (keyword.test(key)) results.push(this.get(key));
    }

    return results;
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
      entries[key] = val;
    }

    return entries;
  }

}

module.exports = RefCache;