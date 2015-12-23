var colors = require('colors');
var table = require('cli-table');

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

  render() {
    let t = new table({
      head: this.col[0].queryParams.fetch
      // colWidths: [20, 200]
    });

    this.col.forEach(task => {
      let values = task.queryParams.fetch.map(key => {
        return task.get(key);
      });

      t.push(values);
    });

    console.log(t.toString());
  }
}

module.exports = Tasks;