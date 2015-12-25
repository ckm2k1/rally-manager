'use strict';
let path = require('path');
var util = require('./util');

let configPath = path.resolve(process.env.HOME, '.rallyrc');

let defaultConfig = {
  iteration: null,
  project: null,
  workspace: null,
  username: null,
  password: null
};


class Config {
  constructor() {
    util.fs.ensureFile(configPath, defaultConfig);
    let config = util.fs.readFile(configPath);
    this.config = JSON.parse(config);

    return this;
  }

  get project() {
    return this.config.project;
  }
  set project(project) {
    this.config.project = project;
    this.save();
  }

  get workspace() {
    return this.config.workspace;
  }
  set workspace(workspace) {
    this.config.workspace = workspace;
    this.save();
  }

  get iteration() {
    return this.config.iteration;
  }
  set iteration(iteration) {
    this.config.iteration = iteration;
    this.save();
  }

  get username() {
    return this.config.username;
  }
  set username(username) {
    this.config.username = username;
    this.save();
  }

  get password() {
    return this.config.password;
  }
  set password(password) {
    this.config.password = password;
    this.save();
  }

  save() {
    util.fs.writeJSON(configPath, this.config);
    return this;
  }
}

module.exports = Config;