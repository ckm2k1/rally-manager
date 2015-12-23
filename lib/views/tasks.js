'use strict';
let table = require('table');

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
    data.unshift(Object.assign([], this.col.modelClass.queryParams.fetch.map((k) => {
      return k.blue;
    })));

    let tableConfig = {
      columns: {
        1: {
          width: 30,
          wrapWord: true
        },
        2: {
          width: 30,
          wrapWord: true
        },
      }
    };
    let o = table.default(data, tableConfig);

    console.log(o);
  }
}

module.exports = Tasks;