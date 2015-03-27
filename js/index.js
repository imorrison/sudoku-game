(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var gameState = [
    [5, 3, -1, -1, 7, -1, -1, -1, -1],
    [6, -1, -1, 1, 9, 5, -1, -1, -1],
    [-1, 9, 8, -1, -1, -1, -1, 6, -1],
    [8, -1, -1, -1, 6, -1, -1, -1, 3],
    [4, -1, -1, 8, -1, 3, -1, -1, 1],
    [7, -1, -1, -1, 2, -1, -1, -1, 6],
    [-1, 6, -1, -1, -1, -1, 2, 8, -1],
    [-1, -1, -1, 4, 1, 9, -1, -1, 5],
    [-1, -1, -1, -1, 8, -1, -1, 7, 9]
];

var Game = require('./game');

var init = function(puzzle) {
  var game = new Game(puzzle);
  game.initialize();
};

init(gameState);

},{"./game":3}],2:[function(require,module,exports){
'use strict';

var mCopy = require('./helpers').mCopy;


var Board = function(data) {
  this.original = data
  this.data = mCopy(data); // mutate copy
};

Board.prototype.set = function(val, x, y) {
  this.data[x][y] = val;
  return this;
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

},{"./helpers":4}],3:[function(require,module,exports){
'use strict';

var Board = require('./board');
var helpers = require('./helpers');
var toArray = helpers.toArray;
var coordToSelector = helpers.coordToSelector;
var datasetToCoord = helpers.datasetToCoord;
var mForEach = helpers.mForEach;
var set = [0, 1, 2, 3, 4, 5, 6, 7, 8];


var Game = function(newBoardState) {
  this.board = new Board(newBoardState);
  this.inputs = toArray(document.querySelectorAll('input'));
  this.statusEl = document.getElementById('status-box');
  this.resetBtn = document.getElementById('clear');
  this.checkBtn = document.getElementById('validate');
};

Game.prototype.initialize = function() {
  this.render();
  this.listenToInputs();
  this.listenToCheck();
  this.listenToReset();
};

Game.prototype.render = function() {
  var selector, el;

  mForEach(this.board.data, function(val, x, y) {
    selector = coordToSelector(x, y)
    el = document.querySelector(selector);
    if (val !== -1) {
      el.disabled = true;
      el.value = val;
    } else {
      el.value = '';
    }
  });
};

Game.prototype.listenToInputs = function() {
  var onChange = this.onChange.bind(this);

  this.inputs.forEach(function(el) {
    el.addEventListener('input', onChange);
  });
};

Game.prototype.onChange = function(event) {
  var value = Number(event.target.value);
  var coord = datasetToCoord(event.target.dataset.coord);
  // only except numbers 1 - 9, otherwise reset value 
  if (value > 9 || value < 1) {
    event.target.value = '';
    this.board.set(-1, coord[0], coord[1]);
    return;
  }

  this.board.set(value, coord[0], coord[1]);
  this.checkStatus();
};

Game.prototype.listenToCheck = function() {
  var onCheck = this.checkStatus.bind(this);
  this.checkBtn.addEventListener('click', onCheck);
};

Game.prototype.listenToReset = function() {
  var onReset = this.reset.bind(this);
  this.resetBtn.addEventListener('click', onReset);
};

Game.prototype.checkStatus = function() {
  var sections = this.board.solved();
  console.log(sections);
  this.removeInvalidMarks();
  this.markInvalidSections(sections);
  
  if (this.board.complete()) {
    if (sections.valid) {
      this.statusEl.innerHTML = '<p>you win</p>';
    } else {
      this.statusEl.innerHTML = '<p>not yet</p>';
    }
  } else {
    this.statusEl.innerHTML = '';
  }
};

Game.prototype.reset = function() {
  this.statusEl.innerHTML = '';
  this.board.reset();
  this.render();
};

Game.prototype.markInvalidSections = function(sections) {
  var el, selector;
  sections.sqr.forEach(function(sqr) {
    el = document.getElementById(sqr)
    el.setAttribute('class', 'invalid');
  });

  sections.row.forEach(function(row) {
    set.forEach(function(i) {
      selector = coordToSelector(row, i);
      el = document.querySelector(selector);
      el.className = 'invalid';
    });
  });

  sections.col.forEach(function(col) {
    set.forEach(function(i) {
      selector = coordToSelector(i, col);
      el = document.querySelector(selector);
      el.className = 'invalid';
    });
  });
};

Game.prototype.removeInvalidMarks = function() {
  var el, selector;
  mForEach(this.board.data, function(val, x, y) {
    selector = coordToSelector(x, y)
    el = document.querySelector(selector);
    el.className === 'invalid'
    el.className = '';
  });

  set.forEach(function(n) {
    el = document.getElementById(n);
    el.className = '';
  });
}

module.exports = Game;

},{"./board":2,"./helpers":4}],4:[function(require,module,exports){
'use strict';

module.exports = {
  toArray: function(arraylikeObject) {
    return Array.prototype.slice.call(arraylikeObject);
  },
  mForEach: function(matrix, cb) {
    var i, j;
    var length = matrix.length

    for (i = 0; i < length; i++) {
      for (j = 0; j < matrix[i].length; j++) {
        cb(matrix[i][j],i,j);
      }
    }
  },
  mCopy: function(matrix) {
    // naive copy for matrix with numerical values
    return matrix.map(function(row) {
      return row.slice();
    });
  },
  coordToSelector: function(x, y) {
    x = String(x);
    y = String(y);
    return '[data-coord="[' + x + ',' + y + ']"]';
  },
  datasetToCoord: function(coordString) {
    return coordString.match(/\d+/g).map(Number);
  }
};

},{}]},{},[1]);
