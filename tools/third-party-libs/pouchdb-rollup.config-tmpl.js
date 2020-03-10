const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const nodeResolve = require('@rollup/plugin-node-resolve');
const nodeGlobals = require('rollup-plugin-node-globals');
const nodePolyfills = require('rollup-plugin-node-polyfills');
const sourcemaps = require('rollup-plugin-sourcemaps');

const MODULE_NAME = '$MODULE_NAME';
const GLOBALS = $GLOBALS;

let plugins = [
  nodeResolve({
    preferBuiltins: false,
    mainFields: ['browser', 'module', 'main'],
    jail: process.cwd(),
  }),
  commonjs({ignoreGlobal: true}),
  nodeGlobals(),
  nodePolyfills(),
  json(),
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
