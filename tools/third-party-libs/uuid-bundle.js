const path = require('path');

const cwd = process.cwd();

module.exports = {
  mode: 'development',
  entry: path.resolve(cwd, 'node_modules/uuid/index.js'),
  output: {
    path: path.resolve(cwd, './node_modules/uuid'),
    filename: 'uuid.umd.js',
    library: 'uuid',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
