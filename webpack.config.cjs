'use strict';

const path = require('path');

module.exports = {
  entry: './build/lib/index.js',
  mode: 'production',
  output: {
    path: path.resolve('./', 'dist'),
    filename: 'aeskeywrap.js',
    globalObject: 'this',
    library: {
      name: 'aeskeywrap',
      type: 'umd'
    }
  }
};
