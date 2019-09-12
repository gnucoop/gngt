/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

/** Type declaration for ambient System. */
declare const System: any;

// Configure the base path and map the different node packages.
System.config({
  paths: {'node:*': 'node_modules/*', 'bundles:*': 'bundles/*'},
  map: {
    'traceur': 'node:traceur/bin/traceur.js',

    'main': 'main.js',

    'date-fns': 'node:date-fns/date-fns.umd.js',
    'debug': 'node:debug/debug.umd.js',
    'pouchdb': 'node:pouchdb/pouchdb.umd.js',
    'pouchdb-debug': 'node:pouchdb-debug/pouchdb-debug.umd.js',
    'pouchdb-find': 'node:pouchdb-find/pouchdb-find.umd.js',
    'rxjs': 'node_modules/rxjs/bundles/rxjs.umd.min.js',
    'rxjs/operators': 'system-rxjs-operators.js',
    'tslib': 'node:tslib/tslib.js',
    'url-parse': 'node:url-parse/url-parse.umd.js',
    'uuid': 'node:uuid/uuid.umd.js',
    'tslib': 'node:tslib/tslib.js',

    // Angular specific mappings.
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.js',
    '@angular/cdk/bidi': 'node:@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/coercion': 'node:@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'node:@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/keycodes': 'node:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/overlay': 'node:@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/platform': 'node:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'node:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/scrolling': 'node:@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.js',
    '@angular/common/http': 'node:@angular/common/bundles/common-http.umd.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.js',
    '@angular/elements': 'node:@angular/elements/bundles/elements.umd.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.js',
    '@angular/router': 'node:@angular/router/bundles/router.umd.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser/animations':
        'node:@angular/platform-browser/bundles/platform-browser-animations.umd',
    '@angular/platform-browser': 'node:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic':
        'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

    '@ionic/core': 'node:@ionic/core/core.umd.js',
    '@ionic/core/loader': 'node:@ionic/core/core-loader.umd.js',
    '@ionic/angular': 'node:@ionic/angular/angular.umd.js',

    '@ngx-translate/core': 'node:@ngx-translate/core/bundles/ngx-translate-core.umd.js',
    '@ngx-translate/http-loader':
        'node:@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd.js',

    '@gngt/core': 'dist/packages/core/index.js',
    '@gngt/ionic': 'dist/packages/ionic/index.js',
    '@gngt/ionic-examples': 'dist/packages/ionic-examples/index.js',

    '@gngt/core/calendar': 'dist/packages/core/calendar/index.js',
    '@gngt/core/chart': 'dist/packages/core/chart/index.js',
    '@gngt/core/checkbox-group': 'dist/packages/core/checkbox-group/index.js',
    '@gngt/core/common': 'dist/packages/core/common/index.js',
    '@gngt/core/forms': 'dist/packages/core/forms/index.js',
    '@gngt/core/image': 'dist/packages/core/image/index.js',
    '@gngt/core/map': 'dist/packages/core/map/index.js',
    '@gngt/core/models': 'dist/packages/core/models/index.js',
    '@gngt/core/node-icon': 'dist/packages/core/node-icon/index.js',
    '@gngt/core/page-break': 'dist/packages/core/page-break/index.js',
    '@gngt/core/page-slider': 'dist/packages/core/page-slider/index.js',
    '@gngt/core/reports': 'dist/packages/core/reports/index.js',
    '@gngt/core/table': 'dist/packages/core/table/index.js',
    '@gngt/core/text': 'dist/packages/core/text/index.js',
    '@gngt/core/utils': 'dist/packages/core/utils/index.js',
    '@gngt/ionic/calendar': 'dist/packages/ionic/calendar/index.js',
    '@gngt/ionic/checkbox-group': 'dist/packages/ionic/checkbox-group/index.js',
    '@gngt/ionic/forms': 'dist/packages/ionic/forms/index.js',
    '@gngt/ionic/image': 'dist/packages/ionic/image/index.js',
    '@gngt/ionic/node-icon': 'dist/packages/ionic/node-icon/index.js',
    '@gngt/ionic/page-slider': 'dist/packages/ionic/page-slider/index.js',
    '@gngt/ionic/reports': 'dist/packages/ionic/reports/index.js',
  },
  packages: {
    // Thirdparty barrels.
    'rxjs': {main: 'index'},
    'rxjs/operators': {main: 'index'},

    // Set the default extension for the root package, because otherwise the dev-app-map can't
    // be built within the production mode. Due to missing file extensions.
    '.': {defaultExtension: 'js'}
  }
});
