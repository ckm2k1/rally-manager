'use strict';
let table = require('table');
var childProc = require('child_process');

let colorMap = {
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

class Tasks {
  template(model) {
    let str = '';

    model.queryParams.fetch.forEach(p => {
      str += `${model.get(p)}\t`;
    });

    return str.trimRight();
  }

  constructor(col) {
    this.col = col;
  }

  getColor(key, val) {
    key = key.toString();
    val = val.toString();
    if (colorMap[key]) {
      return val[colorMap[key].values[val]];
    }
    return val;
  }

  render() {
    let data = this.col.map(task => {
      let values = task.queryParams.fetch.map(key => {
        return this.getColor(key, task.get(key));
      });

      return values;
    });
    let headers = this.col.modelClass.queryParams.fetch.map((k) => {
      return k.blue;
    });
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

    let tableConfig = {
      columns: columnsConfig
    };
    let o = table.default(data, tableConfig);

    console.log(o);
  }
}

module.exports = Tasks;