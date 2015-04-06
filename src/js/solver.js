'use strict';

var Board = require('./board');
var gameState = require('./puzzle');


var solve = function(board) {
  // base case, if board is solved, return
  if (board.complete()) {
    return true;
  } else {
    var next = findNextEmptySquare(board);
    var moves = next.moves;
    var coord = next.coord;
    moves.forEach(function(move) {
      board.set(move, coord[0], coord[1]);
      if (solve(board)) {
        return true;
      }
    });

    if (moves.length === 0) {
      undoMove(board, coord[0], coord[1]);
      return false;
    }
  }
  return board.data;
};


var possibleMoves = function(board, coord) {
 return union(availableRow(board, coord), availableCol(board, coord), availableSqr(board, coord));
};

var findNextEmptySquare = function(board) {
  // pick the most constrained square
  var bestSqr, bestMoves, moves;
  var currentLow = 9;
  for (var i = 0; i < board.data.length; i++) {
    for (var j = 0; j < board.data.length; j++) {
      if (board.data[i][j] === -1) {
        moves = possibleMoves(board, [i, j]);
        if (moves.length < currentLow) {
          bestSqr = [i, j];
          bestMoves = moves;
          currentLow = moves.length;
        }
      }
    }
  }
  return {'coord': bestSqr, 'moves': bestMoves};
};

var availableRow = function(board, coord) {
  var available = [];
  var pos = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  board.data[coord[0]].forEach(function(val) {
    pos[val] = 1;
  });

  pos.forEach(function(j, i) {
    if (j === 0) available.push(i);
  });
  return available;
};

var availableCol = function(board, coord) {
  var available = [];
  var pos = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (var i = 0; i < board.data.length; i++) {
    var n = board.data[i][coord[1]];
    pos[n] = 1;
  }

  pos.forEach(function(j, i) {
    if (j === 0) available.push(i);
  });
  return available;
};

var availableSqr = function(board, coord) {
  var available = [];
  var pos = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var reduceCoords = function(x) {
    if (x < 3) return 0;
    if (x >= 3 && x < 6) return 3;
    if (x >= 6 && x < 9 ) return 6;
  };

  var start = coord.map(reduceCoords);

  for (var i = start[0]; i < start[0]+3; i++) {
    for(var j = start[1]; j < start[1]+3; j++) {
      var val = board.data[i][j];
      if (val !== -1) {
        pos[val] = 1;
      }
    }
  }

  pos.forEach(function(x, i) {
    if (x === 0) available.push(i);
  });
  return available;
};

var union = function(x, y, z) {
  var result = [];
  var count = {};
  var addToo = function(val) {
    if (count.hasOwnProperty(val)) {
      count[val] += 1;
    } else {
      count[val] = 1;
    }
  };

  x.forEach(addToo);
  y.forEach(addToo);
  z.forEach(addToo);
  for (var key in count) {
   if (count[key] === 3) {
     result.push(key);
   }
  }
  return result;
};

var undoMove = function(board, x, y) {
  board.set(-1, x, y);
};

var board = new Board(gameState);

console.log(solve(board));


