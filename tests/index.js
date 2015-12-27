/*jshint expr:true*/
var chai = require('chai');
var chaiSinon = require('sinon-chai');
var expect = chai.expect;
chai.use(chaiSinon);
var Model = require('../lib/models/base');

describe('Model', function () {
  var model;
  beforeEach(function() {
    model = new Model();
  });

  it('should do what...', function () {
    expect('some').to.be.truthy;
  });


});