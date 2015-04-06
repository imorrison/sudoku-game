'use strict';

var mCopy = require('./helpers').mCopy;


var Board = function(data) {
  this.original = data
  this.data = mCopy(data); // mutate copy
};

Board.prototype.set = function(val, x, y) {
  val = Number(val);
  this.data[x][y] = val;
};


Board.prototype.get = function(x, y) {
  return this.data[x][y];
}

Board.prototype.validColumn = function(col) {
  var valid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var num, i;

  for (i = 0; i < this.data.length; i++) {
    num = this.data[i][col];
    if (num === -1 || valid[num-1] > 1) {
      return false;
    } else {
      valid[num-1] += 1;
    }
  }

  for (i = 0; i < valid.length; i++) {
    if (valid[i] !== 1) {
      return false;
    }
  }

  return true;
};

Board.prototype.validRow = function(row) {
  var valid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var num, i;

  var boardRow = this.data[row];

  for (i = 0; i < boardRow.length; i++) {
    num = boardRow[i];
    if (num === -1 || valid[num-1] > 1) {
      return false;
    } else {
      valid[num-1] += 1;
    }
  }
 
  for (i = 0; i < valid.length; i++) {
    if (valid[i] !== 1) {
      return false;
    }
  }

  return true;
};

Board.prototype.validSquare = function(sqr) {
  var coords = {
    1:[0,0],
    2:[0,3],
    3:[0,6],
    4:[3,0],
    5:[3,3],
    6:[3,6],
    7:[6,0],
    8:[6,3],
    9:[6,6]
  };

  var corner = coords[sqr+1];

  var valid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  var num, i, j;

  for (i = corner[0]; i < corner[0]+3; i++) {
    for (j = corner[1]; j < corner[1] + 3; j++) {
      num = this.data[i][j];
      if (num === -1 || valid[num-1] > 1) {
        return false;
      } else {
        valid[num-1] += 1;
      }
    }
  }

  for (i = 0; i < valid.length; i++) {
    if (valid[i] !== 1) {
      return false;
    }
  }

  return true;
};

Board.prototype.complete = function() {
  for (var i = 0; i < this.data.length; i++) {
    for (var j = 0; j < this.data.length; j++) {
      if (this.data[i][j] === -1 ) {
        return false;
      }
    }
  }

  return true;
};

Board.prototype.solved = function() {
  var row, col, sqr;
  var invalidSections = {
    row: [],
    col: [],
    sqr: [],
    valid: true
  };

  for (var i = 0; i < this.data.length; i++) {
    row = this.validRow(i);
    col = this.validColumn(i);
    sqr = this.validSquare(i);
 
    if (!row) {
      invalidSections.row.push(i);
    }
    if (!col) {
      invalidSections.col.push(i);
    }
    if (!sqr) {
      invalidSections.sqr.push(i);
    }

  }

  if (invalidSections.row.length || invalidSections.col.length || invalidSections.sqr.length) {
    invalidSections.valid = false;
  }
  return invalidSections;
};

Board.prototype.reset = function() {
  var cp = mCopy(this.original);
  this.data = cp;
};

module.exports = Board;
