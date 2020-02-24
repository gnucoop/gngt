var cjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'node_modules/date-fns/index.js',
  output: {
    amd: {id: 'date-fns'},
    name: 'date-fns',
    file: 'node_modules/date-fns/date-fns.umd.js',
    format: 'umd'
  },
  plugins: [
    cjs(),
  ],
};
