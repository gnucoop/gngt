const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve');
const nodeGlobals = require('rollup-plugin-node-globals');
const nodePolyfills = require('rollup-plugin-node-polyfills');
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
  nodeGlobals(),
  nodePolyfills(),
  json(),
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
