var cjs = require('rollup-plugin-commonjs');
var babel = require('rollup-plugin-babel');

module.exports = {
  input: 'node_modules/@ionic/core/loader/index.cjs.js',
  external: [
    'tslib',
  ],
  output: {
    amd: {id: '@ionic/core/loader'},
    name: '@ionic/core/loader',
    file: 'node_modules/@ionic/core/core-loader.umd.js',
    format: 'umd',
    exports: 'named',
    globals: {
      'tslib': 'tslib',
    }
  },
  plugins: [
    cjs(),
    babel({
      presets: [
        ['@babel/preset-env', {targets: 'last 2 chrome version, last 2 firefox version'}],
      ],
      runtimeHelpers: false,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
      ],
    }),
  ],
};
