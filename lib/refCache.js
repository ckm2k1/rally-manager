'use strict';
let fs = require('fs');
let path = require('path');
var models = require('./models');
var util = require('./util');

let cacheFile = path.resolve(process.env.HOME, '.rally-ref-cache');

class RefCache extends Map {
  constructor() {
    super();

    this.ensureFile();
    let map = fs.readFileSync(cacheFile, 'utf8');
    this.vivify(map ? JSON.parse(map) : {});

    return this;
  }

  vivify(json) {
    for(let [keyword, attrs] of util.object.entries(json)) {
      super.set(keyword, new models[attrs._type](attrs));
    }
  }

  ensureFile() {
    let exists = fs.existsSync(cacheFile);
    if (!exists) fs.writeFileSync(cacheFile, JSON.stringify({}), 'utf8');
  }

  save() {
    fs.writeFileSync(cacheFile, JSON.stringify(this.toJSON()), 'utf8');
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