var cjs = require('rollup-plugin-commonjs');
var node = require('rollup-plugin-node-resolve');

module.exports = {
  input: 'node_modules/url-parse/index.js',
  output: {
    amd: {id: 'url-parse'},
    name: 'url-parse',
    file: 'node_modules/url-parse/url-parse.umd.js',
    format: 'umd',
    exports: 'named'
  },
  plugins: [
    cjs(),
    node(),
  ],
};
