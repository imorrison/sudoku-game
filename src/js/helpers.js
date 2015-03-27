'use strict';

module.exports = {
  toArray: function(arraylikeObject) {
    return Array.prototype.slice.call(arraylikeObject);
  },
  matrixForEach: function(matrix, cb) {
    var i, j;
    var length = matrix.length

    for (i = 0; i < length; i++) {
      for (j = 0; j < matrix[i].length; j++) {
        cb(matrix[i][j], [i, j]);
      }
    }
  },
  mCopy: function(matrix) {
    // naive copy for matrix with numerical values
    return matrix.map(function(row) {
      return row.slice();
    });
  }
};
