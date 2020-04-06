const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

const EXPORTS = '$EXPORTS';
const MAIN_FIELDS = '$MAIN_FIELDS';
const MODULE_NAME = '$MODULE_NAME';
const GLOBALS = $GLOBALS;
const NAMED_EXPORTS = $NAMED_EXPORTS;

let plugins = [
  nodeResolve(
      {preferBuiltins: false, mainFields: MAIN_FIELDS, jail: process.cwd()}),
  commonjs({ignoreGlobal: true}),
  sourcemaps(),
];

const config = {
  external: Object.keys(GLOBALS),
  output: [{
    amd: {id: MODULE_NAME},
    name: MODULE_NAME,
    globals: GLOBALS,
    exports: EXPORTS,
    namedExports: NAMED_EXPORTS,
  }],
  plugins,
};

module.exports = config;
