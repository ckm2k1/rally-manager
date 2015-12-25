'use strict';

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

module.exports = {
  object: {
    entries: objectEntries,
    pairs: objectPairs
  }
};