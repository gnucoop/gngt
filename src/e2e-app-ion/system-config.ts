/** Type declaration for ambient System. */
declare const System: any;

// Apply the CLI SystemJS configuration.
System.config({
  paths: {
    'node:*': 'node_modules/*',
  },
  map: {
    'plugin-babel': 'node:systemjs-plugin-babel/plugin-babel.js',
    'systemjs-babel-build': 'node:systemjs-plugin-babel/systemjs-babel-browser.js',
    'rxjs': 'node:rxjs',
    'main': 'main.js',
    'date-fns': 'node:date-fns/min/index.js',
    'tslib': 'node:tslib/tslib.js',
    'url-parse': 'node:url-parse/dist/url-parse.min.js',

    // Angular specific mappings.
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.js',
    '@angular/common/http': 'node:@angular/common/bundles/common-http.umd.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.js',
    '@angular/router': 'node:@angular/router/bundles/router.umd.js',
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser': 'node:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser/animations':
      'node:@angular/platform-browser/bundles/platform-browser-animations.umd.js',
    '@angular/platform-browser-dynamic':
      'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

    '@ionic/core': 'node:@ionic/core',
    '@ionic/core/dist/ionic/svg': 'empty',
    '@ionic/core/loader': 'node:@ionic/core/loader',
    '@ionic/angular': 'node:@ionic/angular',
    '@ionic/angular/dist/directives': 'node:@ionic/angular/dist/directives',
    '@ionic/angular/dist/providers': 'node:@ionic/angular/dist/providers',

    '@ngrx/store': 'node:@ngrx/store/bundles/store.umd.js',
    '@ngrx/effects': 'node:@ngrx/effects/bundles/effects.umd.js',

    '@ngx-translate/core': 'node:@ngx-translate/core/bundles/ngx-translate-core.umd.js',
    '@ngx-translate/http-loader':
      'node:@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd.js',

    '@gngt/core/admin': 'dist/bundles/core-admin.umd.js',
    '@gngt/core/auth': 'dist/bundles/core-auth.umd.js',
    '@gngt/core/common': 'dist/bundles/core-common.umd.js',
    '@gngt/core/model': 'dist/bundles/core-model.umd.js',
    '@gngt/core/reducers': 'dist/bundles/core-reducers.umd.js',

    '@gngt/ionic/admin': 'dist/bundles/ionic-admin.umd.js',
    '@gngt/ionic/auth': 'dist/bundles/ionic-auth.umd.js',
    '@gngt/ionic/common': 'dist/bundles/ionic-common.umd.js',
    '@gngt/ionic/model': 'dist/bundles/ionic-model.umd.js',
    '@gngt/ionic-examples': 'dist/bundles/ionic-examples.umd.js',
  },
  packages: {
    // Thirdparty barrels.
    'rxjs': {main: 'index'},
    'rxjs/operators': {main: 'index'},
    '@ionic/core': {main: 'dist/esm/es5/index'},
    '@ionic/core/loader': {main: 'index'},
    '@ionic/angular': {main: 'dist/index'},
    '@ionic/angular/dist/directives': {main: 'index'},
    '@ionic/angular/dist/providers': {main: 'index'},

    // Set the default extension for the root package, because otherwise the demo-app-mat can't
    // be built within the production mode. Due to missing file extensions.
    '.': {
      defaultExtension: 'js'
    }
  },
  transpiler: 'plugin-babel'
});
