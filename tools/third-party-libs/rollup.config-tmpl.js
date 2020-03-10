const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

const MODULE_NAME = '$MODULE_NAME';
const GLOBALS = $GLOBALS;

let plugins = [
  nodeResolve(
      {preferBuiltins: false, mainFields: ['browser', 'module', 'main'], jail: process.cwd()}),
  commonjs({ignoreGlobal: true}),
  sourcemaps(),
];

const config = {
  external: Object.keys(GLOBALS),
  output: {
    amd: {id: MODULE_NAME},
    name: MODULE_NAME,
    globals: GLOBALS,
    exports: 'named',
  },
  plugins,
};

module.exports = config;
