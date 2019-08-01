const path = require('path');

const cwd = process.cwd();

module.exports = {
  mode: 'development',
  entry: path.resolve(cwd, 'node_modules/pouchdb-find/lib/index.es.js'),
  output: {
    path: path.resolve(cwd, './node_modules/pouchdb-find'),
    filename: 'pouchdb-find.umd.js',
    library: 'pouchdb-find',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
