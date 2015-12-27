'use strict';
let UsersCol = require('../collections').Users;
let View = require('./view');
let table = require('table');

class Users extends View {
  get collection() {
    return UsersCol;
  }

  render() {
    let data = this.col.map((model) => {
      return [model.get('_refObjectName')];
    });
    data.unshift(['Name']);

    console.log(table.default(data));
  }

  // transform(attrs) {
  //   attrs.UserName = `${attrs._refObjectName}`;

  //   return attrs;
  // }
}

module.exports = Users;