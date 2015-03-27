'use strict';

var Board = require('./board');
var helpers = require('./helpers');
var toArray = helpers.toArray;
var coordToSelector = helpers.coordToSelector;
var datasetToCoord = helpers.datasetToCoord;
var mForEach = helpers.mForEach;

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
  if (this.board.complete()) {
    if (this.board.solved()) {
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

module.exports = Game;
