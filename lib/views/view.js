'use strict';
let table = require('table');
// let childProc = require('child_process');
let collections = require('../collections');

class View {
  constructor(models) {
    let col = new this.collection(models instanceof Array ? models : [models]);
    this.col = col;
  }

  get colorMap() {
    return {
      Blocked: {
        values: {
          false: 'green',
          true: 'red'
        }
      },
      State: {
        values: {
          Completed: 'green',
          Defined: 'red',
          'In-Progress': 'yellow'
        }
      }
    };
  }

  get collection() {
    return collections.Collection;
  }

  template(model) {
    let str = '';

    model.queryParams.fetch.forEach(p => {
      str += `${model.get(p)}\t`;
    });

    return str.trimRight();
  }

  getColor(key, val) {
    if (!key || !val) return val;
    key = key.toString();
    val = val.toString();
    if (this.colorMap[key]) {
      return val[this.colorMap[key].values[val]];
    }
    return val;
  }

  serialize(displayAttrs) {
    return this.col.map(task => {
      let attrs = this.transform(task.toJSON());

      return displayAttrs.map(key => {
        return this.getColor(key, attrs[key]);
      });
    });
  }

  getHeaders(displayAttrs) {
    return displayAttrs.map((k) => {
      return k.blue;
    });
  }

  render() {

    let displayAttrs = Object.assign([], this.col.modelClass.queryParams.fetch);
    let data = this.serialize(displayAttrs);
    let headers = this.getHeaders(displayAttrs);
    data.unshift(Object.assign([], headers));

    // let [, screenWidth] = childProc.execSync('xdpyinfo | grep dimensions').toString().match(/(\d+)x\d+ pixels/);
    let [consoleWidth] = process.stdout.getWindowSize();

    let columnsConfig = {};
    headers.forEach((header, index) => {
      columnsConfig[index] = {
        width: Math.floor(consoleWidth / headers.length) - 3,
        wrapWord: true
      };
    });

    let o = table.default(data, {
      columns: columnsConfig
    });

    console.log(o);
  }

  transform(attrs) {
    return attrs;
  }
}

module.exports = View;