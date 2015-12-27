'use strict';
let fs = require('fs');

Reflect.ownKeys = function(obj) {
  return Object
    .getOwnPropertyNames(obj)
    .concat(Object.getOwnPropertySymbols(obj));
};

function objectEntries(obj) {
  var keys = Reflect.ownKeys(obj);

  return {
    [Symbol.iterator]() {
      return this;
    },
    next: function() {
      let data = {
        done: !keys.length
      };

      let currentKey = keys.shift();
      if (!data.done) data.value = [currentKey, obj[currentKey]];
      return data;
    }
  };
}

function objectPairs(arr) {
  let obj = {};

  for (let i = 0; i < arr.length; i += 2) {
    obj[arr[i]] = arr[i + 1];
  }

  return obj;
}

function fsWriteJSON(file, json, enc = 'utf8') {
  fs.writeFileSync(file, JSON.stringify(json), enc);
}

function fsEnsureFile(file, defaultContent = {}, enc = 'utf8') {
  let exists = fs.existsSync(file);
  if (!exists) fsWriteJSON(file, defaultContent, enc);
}

function fsReadFile(file, enc = 'utf8') {
  return fs.readFileSync(file, enc);
}

function soak(obj, path) {
  let pathComponents = path.split('.').reverse();
  if (!pathComponents.length) return obj;

  let branch = pathComponents.pop();
  try {
    let m = branch.match(/\[(\d+)\]/);
    let value = obj[m ? m[1] : branch];
    if (!pathComponents.length) return value;
    else return soak(value, pathComponents.join('.'));
  } catch (e) {
    return undefined;
  }
}

const DEBUG = process.env.DEBUG === 'true';
function printError(err) {
  console.log(err.message.red);
  if (DEBUG) {
    console.log(err.stack);
  }
}

module.exports = {
  object: {
    entries: objectEntries,
    pairs: objectPairs,
    soak: soak
  },
  fs: {
    writeJSON: fsWriteJSON,
    ensureFile: fsEnsureFile,
    readFile: fsReadFile
  },
  printError
};