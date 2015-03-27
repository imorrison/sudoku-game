'use strict';

var chai = require('chai');
var expect = chai.expect;
var fixure = require('./fixure');

var Board = require('../src/js/board');

describe('Board', function() {
  var solvedBoard, unsolvedBoard, incorrectBoard;

  before(function() {
    solvedBoard = new Board(fixure.solved);
    unsolvedBoard = new Board(fixure.unsolved);
    incorrectBoard = new Board(fixure.wrong);
  });

  it('can have a value set', function() {
    unsolvedBoard.set(4, 0, 2);
    expect(unsolvedBoard.data[0][2]).to.equal(4);
  });

  it('should check if a column is valid', function() {
    expect(incorrectBoard.validColumn(2)).to.be.false;
    expect(solvedBoard.validColumn(2)).to.be.true;
  });

  it('should check if a row is valid', function() {
    expect(incorrectBoard.validRow(0)).to.be.false;
    expect(solvedBoard.validRow(0)).to.be.true;
  });

  it('should check if a sub square is valid', function() {
    expect(incorrectBoard.validSquare(0)).to.be.false;
    expect(solvedBoard.validSquare(0)).to.be.true;
  });

  it('should check if the board is complete', function() {
    expect(incorrectBoard.complete()).to.be.true;
    expect(solvedBoard.complete()).to.be.true;
    expect(unsolvedBoard.complete()).to.be.false;
  });

  it('should check if the board is solved', function() {
    expect(incorrectBoard.solved()).to.be.false;
    expect(solvedBoard.solved()).to.be.true;
  });
});
