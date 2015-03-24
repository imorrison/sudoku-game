'use strict';

module.exports = function(config) {
  var configuration = {
    browserify: {
      debug: true,
      watch: true
    },
    files: [
      'unit_tests/test-setup.js',
      'unit_tests/*-spec.js'  
    ],
    frameworks: ['mocha', 'browserify'],
    browsers: ['PhantomJS'],
    preprocessors: {
      'unit_tests/**/*.js': ['browserify']
    },
    reporters: ['spec']
  };

  config.set(configuration);
};
