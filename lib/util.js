'use strict';
let fs = require('fs');

Reflect.ownKeys = function(obj) {
  return Object
    .getOwnPropertyNames(obj)
    .concat(Object.getOwnPropertySymbols(obj));
};

function objectEntries(obj) {
  let keys = Reflect.ownKeys(obj);

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
  console.log(`\n${err.message.red}\n`);
  if (DEBUG) {
    console.log(err.stack);
  }
}

function pluralize(str, revert) {

  let plural = {
    '(quiz)$': "$1zes",
    '^(ox)$': "$1en",
    '([m|l])ouse$': "$1ice",
    '(matr|vert|ind)ix|ex$': "$1ices",
    '(x|ch|ss|sh)$': "$1es",
    '([^aeiouy]|qu)y$': "$1ies",
    '(hive)$': "$1s",
    '(?:([^f])fe|([lr])f)$': "$1$2ves",
    '(shea|lea|loa|thie)f$': "$1ves",
    'sis$': "ses",
    '([ti])um$': "$1a",
    '(tomat|potat|ech|her|vet)o$': "$1oes",
    '(bu)s$': "$1ses",
    '(alias)$': "$1es",
    '(octop)us$': "$1i",
    '(ax|test)is$': "$1es",
    '(us)$': "$1es",
    '([^s]+)$': "$1s"
  };

  let singular = {
    '(quiz)zes$': "$1",
    '(matr)ices$': "$1ix",
    '(vert|ind)ices$': "$1ex",
    '^(ox)en$': "$1",
    '(alias)es$': "$1",
    '(octop|vir)i$': "$1us",
    '(cris|ax|test)es$': "$1is",
    '(shoe)s$': "$1",
    '(o)es$': "$1",
    '(bus)es$': "$1",
    '([m|l])ice$': "$1ouse",
    '(x|ch|ss|sh)es$': "$1",
    '(m)ovies$': "$1ovie",
    '(s)eries$': "$1eries",
    '([^aeiouy]|qu)ies$': "$1y",
    '([lr])ves$': "$1f",
    '(tive)s$': "$1",
    '(hive)s$': "$1",
    '(li|wi|kni)ves$': "$1fe",
    '(shea|loa|lea|thie)ves$': "$1f",
    '(^analy)ses$': "$1sis",
    '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
    '([ti])a$': "$1um",
    '(n)ews$': "$1ews",
    '(h|bl)ouses$': "$1ouse",
    '(corpse)s$': "$1",
    '(us)es$': "$1",
    's$': ""
  };

  let irregular = {
    'move': 'moves',
    'foot': 'feet',
    'goose': 'geese',
    'sex': 'sexes',
    'child': 'children',
    'man': 'men',
    'tooth': 'teeth',
    'person': 'people'
  };

  let uncountable = [
    'sheep',
    'fish',
    'deer',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
  ];

  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(str.toLowerCase()) >= 0)
    return str;

  // check for irregular forms
  for(let word in irregular) {

    let pattern, replace;
    if (revert) {
      pattern = new RegExp(irregular[word] + '$', 'i');
      replace = word;
    } else {
      pattern = new RegExp(word + '$', 'i');
      replace = irregular[word];
    }
    if (pattern.test(str))
      return str.replace(pattern, replace);
  }

  let array;
  if (revert) array = singular;
  else array = plural;

  // check for matches using regular expressions
  for(let reg in array) {

    let pattern = new RegExp(reg, 'i');

    if (pattern.test(str))
      return str.replace(pattern, array[reg]);
  }

  return str;
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
  string: {
    pluralize
  },
  printError
};