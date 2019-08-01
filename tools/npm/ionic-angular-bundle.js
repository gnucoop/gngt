var cjs = require('rollup-plugin-commonjs');

module.exports = {
  input: 'node_modules/@ionic/angular/dist/fesm5.js',
  external: [
    '@angular/common',
    '@angular/core',
    '@angular/forms',
    '@angular/router',
    '@ionic/core',
    '@ionic/core/loader',
    'rxjs',
    'rxjs/operators',
    'tslib',
  ],
  output: {
    amd: {id: '@ionic/angular'},
    name: '@ionic/angular',
    file: 'node_modules/@ionic/angular/angular.umd.js',
    format: 'umd',
    exports: 'named',
    globals: {
      '@angular/common': 'ng.common',
      '@angular/core': 'ng.core',
      '@angular/forms': 'ng.forms',
      '@angular/router': 'ng.router',
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
