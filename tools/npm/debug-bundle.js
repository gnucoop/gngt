var cjs = require('rollup-plugin-commonjs');
var node = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'node_modules/debug/src/browser.js',
  output: {
    amd: {id: 'debug'},
    name: 'debug',
    file: 'node_modules/debug/debug.umd.js',
    format: 'umd',
    exports: 'named'
  },
  plugins: [
    cjs(),
    node(),
  ],
};
