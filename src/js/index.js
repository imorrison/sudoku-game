'use strict';

var gameState = require('./puzzle');

var Game = require('./game');

var init = function(puzzle) {
  var game = new Game(puzzle);
  game.initialize();
};

init(gameState);
