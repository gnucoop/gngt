var cjs = require('rollup-plugin-commonjs');
var babel = require('rollup-plugin-babel');

module.exports = {
  input: 'node_modules/@gic/core/loader/index.cjs.js',
  external: [
    'tslib',
  ],
  output: {
    amd: {id: '@gic/core/loader'},
    name: '@gic/core/loader',
    file: 'node_modules/@gic/core/core-loader.umd.js',
    format: 'umd',
    exports: 'named',
    globals: {
      'tslib': 'tslib',
    }
  },
  plugins: [
    cjs(),
    babel({
      presets: ['@babel/preset-env'],
      runtimeHelpers: true,
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        '@babel/transform-runtime',
      ],
    }),
  ],
};
