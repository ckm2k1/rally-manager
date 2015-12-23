'use strict';
let fs = require('fs');
let path = require('path');

let configPath = path.resolve(process.env.HOME, '.rallyrc');

let defaultConfig = {
  iteration: null,
  project: null,
  workspace: null
};


class Config {
  constructor() {
    this.ensureFile();
    let config = fs.readFileSync(configPath, 'utf8');
    this.config = JSON.parse(config);

    return this;
  }

  ensureFile() {
    let exists = fs.existsSync(configPath);
    if (!exists) fs.writeFileSync(configPath, JSON.stringify(defaultConfig), 'utf8');
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
  set iteration(iterationRef) {
    this.config.iteration = iterationRef;
    this.save();
  }

  save() {
    fs.writeFileSync(configPath, JSON.stringify(this.config), 'utf8');
    return this;
  }
}

module.exports = Config;