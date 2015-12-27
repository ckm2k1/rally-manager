'use strict';
let BaseModel = require('./base');

class User extends BaseModel {
  static get queryParams() {
    return {
      limit: 100,
      fetch: [
        'c_Team',
        'UserName',
        'DisplayName',
        'EmailAddress',
        'Role'
      ],
      type: 'user'
    };
  }
}

module.exports = User;