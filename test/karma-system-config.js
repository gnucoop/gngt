// Configure the base path and map the different node packages.
System.config({
  baseURL: '/base',
  paths: {
    'node:*': 'node_modules/*',
  },
  map: {
    'date-fns': 'node:date-fns/date-fns.umd.js',
    'debug': 'node:debug/debug.umd.js',
    'pouchdb': 'node:pouchdb/pouchdb.umd.js',
    'pouchdb-debug': 'node:pouchdb-debug/pouchdb-debug.umd.js',
    'pouchdb-find': 'node:pouchdb-find/pouchdb-find.umd.js',
    'rxjs': 'node:rxjs',
    'tslib': 'node:tslib/tslib.js',
    'url-parse': 'node:url-parse/url-parse.umd.js',
    'uuid': 'node:uuid/uuid.umd.js',

    // Angular specific mappings.
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/core/testing': 'node:@angular/core/bundles/core-testing.umd.min.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.min.js',
    '@angular/common/testing': 'node:@angular/common/bundles/common-testing.umd.min.js',
    '@angular/common/http': 'node:@angular/common/bundles/common-http.umd.min.js',
    '@angular/common/http/testing': 'node:@angular/common/bundles/common-http-testing.umd.min.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.min.js',
    '@angular/compiler/testing': 'node:@angular/compiler/bundles/compiler-testing.umd.min.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.min.js',
    '@angular/forms/testing': 'node:@angular/forms/bundles/forms-testing.umd.min.js',
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.min.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.min.js',
    '@angular/platform-browser/animations':
        'node:@angular/platform-browser/bundles/platform-browser-animations.umd.min.js',
    '@angular/platform-browser':
        'node:@angular/platform-browser/bundles/platform-browser.umd.min.js',
    '@angular/platform-browser/testing':
        'node:@angular/platform-browser/bundles/platform-browser-testing.umd.min.js',
    '@angular/platform-browser-dynamic':
        'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.min.js',
    '@angular/platform-browser-dynamic/testing':
        'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.min.js',
    '@angular/router': 'node:@angular/router/bundles/router.umd.min.js',

    '@angular/cdk': 'node:@angular/cdk/bundles/cdk.umd.js',
    '@angular/material/button': 'node:@angular/material/bundles/material-button.umd.js',

    '@angular/cdk/a11y': 'node:@angular/cdk/bundles/cdk-a11y.umd.min.js',
    '@angular/cdk/bidi': 'node:@angular/cdk/bundles/cdk-bidi.umd.min.js',
    '@angular/cdk/coercion': 'node:@angular/cdk/bundles/cdk-coercion.umd.min.js',
    '@angular/cdk/collections': 'node:@angular/cdk/bundles/cdk-collections.umd.min.js',
    '@angular/cdk/keycodes': 'node:@angular/cdk/bundles/cdk-keycodes.umd.min.js',
    '@angular/cdk/layout': 'node:@angular/cdk/bundles/cdk-layout.umd.min.js',
    '@angular/cdk/observers': 'node:@angular/cdk/bundles/cdk-observers.umd.min.js',
    '@angular/cdk/overlay': 'node:@angular/cdk/bundles/cdk-overlay.umd.min.js',
    '@angular/cdk/platform': 'node:@angular/cdk/bundles/cdk-platform.umd.min.js',
    '@angular/cdk/portal': 'node:@angular/cdk/bundles/cdk-portal.umd.min.js',
    '@angular/cdk/platform': 'node:@angular/cdk/bundles/cdk-platform.umd.min.js',
    '@angular/cdk/scrolling': 'node:@angular/cdk/bundles/cdk-scrolling.umd.min.js',
    '@angular/cdk/text-field': 'node:@angular/cdk/bundles/cdk-text-field.umd.min.js',
    '@angular/material/button': 'node:@angular/material/bundles/material-button.umd.min.js',
    '@angular/material/card': 'node:@angular/material/bundles/material-card.umd.min.js',
    '@angular/material/core': 'node:@angular/material/bundles/material-core.umd.min.js',
    '@angular/material/dialog': 'node:@angular/material/bundles/material-dialog.umd.min.js',
    '@angular/material/form-field': 'node:@angular/material/bundles/material-form-field.umd.min.js',
    '@angular/material/input': 'node:@angular/material/bundles/material-input.umd.min.js',
    '@angular/material/snack-bar': 'node:@angular/material/bundles/material-snack-bar.umd.min.js',

    '@ngrx/effects': 'node:@ngrx/effects/bundles/effects.umd.js',
    '@ngrx/store': 'node:@ngrx/store/bundles/store.umd.js',

    '@ngx-translate/core': 'node:@ngx-translate/core/bundles/ngx-translate-core.umd.js',
    '@ngx-translate/http-loader':
        'node:@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd.js',

    '@gic/core': 'node:@gic/core/core.umd.js',
    '@gic/core/loader': 'node:@gic/core/core-loader.umd.js',
    '@gic/angular': 'node:@gic/angular/angular.umd.js',
    '@ionic/core': 'node:@ionic/core/core.umd.js',
    '@ionic/core/loader': 'node:@ionic/core/core-loader.umd.js',
    '@ionic/angular': 'node:@ionic/angular/angular.umd.js',

    '@gngt/core': 'dist/packages/core/index.js',
    '@gngt/ionic': 'dist/packages/ionic/index.js',
    '@gngt/material': 'dist/packages/material/index.js',

    '@gngt/core/admin': 'dist/packages/core/admin/index.js',
    '@gngt/core/auth': 'dist/packages/core/auth/index.js',
    '@gngt/core/calendar': 'dist/packages/core/calendar/index.js',
    '@gngt/core/common': 'dist/packages/core/common/index.js',
    '@gngt/core/model': 'dist/packages/core/model/index.js',
    '@gngt/core/reducers': 'dist/packages/core/reducers/index.js',
    '@gngt/core/sync': 'dist/packages/core/sync/index.js',
    '@gngt/core/translations': 'dist/packages/core/translations/index.js',

    '@gngt/ionic/admin': 'dist/packages/ionic/admin/index.js',
    '@gngt/ionic/auth': 'dist/packages/ionic/auth/index.js',
    '@gngt/ionic/common': 'dist/packages/ionic/common/index.js',

    '@gngt/material/admin': 'dist/packages/material/admin/index.js',
    '@gngt/material/auth': 'dist/packages/material/auth/index.js',
    '@gngt/material/model': 'dist/packages/material/model/index.js',
  },
  packages: {
    // Thirdparty barrels.
    'rxjs': {main: 'index'},
    'rxjs/operators': {main: 'index'},

    // Set the default extension for the root package, because otherwise the dev-app-mat can't
    // be built within the production mode. Due to missing file extensions.
    '.': {defaultExtension: 'js'}
  }
});
