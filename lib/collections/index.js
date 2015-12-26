'use strict';

let collections = {
  Projects: require('./projects'),
  Tasks: require('./tasks'),
  Defects: require('./defects'),
  Collection: require('./collection'),
  Stories: require('./stories')
};

module.exports = collections;