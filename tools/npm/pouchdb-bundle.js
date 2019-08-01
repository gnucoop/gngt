const path = require('path');

const cwd = process.cwd();

module.exports = {
  mode: 'development',
  entry: path.resolve(cwd, 'node_modules/pouchdb/lib/index.es.js'),
  output: {
    path: path.resolve(cwd, './node_modules/pouchdb'),
    filename: 'pouchdb.umd.js',
    library: 'pouchdb',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
