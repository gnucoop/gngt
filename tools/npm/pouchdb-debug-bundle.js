const path = require('path');

const cwd = process.cwd();

module.exports = {
  mode: 'development',
  entry: path.resolve(cwd, 'node_modules/pouchdb-debug/lib/index.es.js'),
  output: {
    path: path.resolve(cwd, './node_modules/pouchdb-debug'),
    filename: 'pouchdb-debug.umd.js',
    library: 'pouchdb-debug',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    debug: 'debug',
  },
};
