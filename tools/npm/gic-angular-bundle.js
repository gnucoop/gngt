var cjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'node_modules/@gic/angular/dist/fesm5.js',
  external: [
    '@angular/common',
    '@angular/core',
    '@angular/forms',
    '@angular/router',
    '@gic/core',
    '@gic/core/loader',
    '@ionic/angular',
    '@ionic/core',
    '@ionic/core/loader',
    'rxjs',
    'rxjs/operators',
    'tslib',
  ],
  output: {
    amd: {id: '@gic/angular'},
    name: '@gic/angular',
    file: 'node_modules/@gic/angular/angular.umd.js',
    format: 'umd',
    exports: 'named',
    globals: {
      '@angular/common': 'ng.common',
      '@angular/core': 'ng.core',
      '@angular/forms': 'ng.forms',
      '@angular/router': 'ng.router',
      '@gic/core': 'gic.core',
      '@gic/core/loader': 'gic.core.loader',
      '@ionic/angular': 'ionic.angular',
      '@ionic/core': 'ionic.core',
      '@ionic/core/loader': 'ionic.core.loader',
      'rxjs': 'rxjs',
      'rxjs/operators': 'rxjs.operators',
      'tslib': 'tslib',
    }
  },
  plugins: [
    cjs(),
  ],
};
