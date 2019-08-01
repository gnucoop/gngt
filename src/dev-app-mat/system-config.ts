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
  paths: {'node:*': 'node_modules/*'},
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

    // Angular specific mappings.
    '@angular/cdk': 'node:@angular/cdk/bundles/cdk.umd.js',
    '@angular/core': 'node:@angular/core/bundles/core.umd.js',
    '@angular/common': 'node:@angular/common/bundles/common.umd.js',
    '@angular/common/http': 'node:@angular/common/bundles/common-http.umd.js',
    '@angular/compiler': 'node:@angular/compiler/bundles/compiler.umd.js',
    '@angular/forms': 'node:@angular/forms/bundles/forms.umd.js',
    '@angular/animations': 'node:@angular/animations/bundles/animations.umd.js',
    '@angular/elements': 'node:@angular/elements/bundles/elements.umd.js',
    '@angular/router': 'node:@angular/router/bundles/router.umd.js',
    '@angular/animations/browser': 'node:@angular/animations/bundles/animations-browser.umd.js',
    '@angular/platform-browser/animations':
        'node:@angular/platform-browser/bundles/platform-browser-animations.umd',
    '@angular/platform-browser': 'node:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic':
        'node:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',

    '@angular/cdk/a11y': 'node:@angular/cdk/bundles/cdk-a11y.umd.js',
    '@angular/cdk/accordion': 'node:@angular/cdk/bundles/cdk-accordion.umd.js',
    '@angular/cdk/bidi': 'node:@angular/cdk/bundles/cdk-bidi.umd.js',
    '@angular/cdk/coercion': 'node:@angular/cdk/bundles/cdk-coercion.umd.js',
    '@angular/cdk/collections': 'node:@angular/cdk/bundles/cdk-collections.umd.js',
    '@angular/cdk/drag-drop': 'node:@angular/cdk/bundles/cdk-drag-drop.umd.js',
    '@angular/cdk/keycodes': 'node:@angular/cdk/bundles/cdk-keycodes.umd.js',
    '@angular/cdk/layout': 'node:@angular/cdk/bundles/cdk-layout.umd.js',
    '@angular/cdk/observers': 'node:@angular/cdk/bundles/cdk-observers.umd.js',
    '@angular/cdk/overlay': 'node:@angular/cdk/bundles/cdk-overlay.umd.js',
    '@angular/cdk/platform': 'node:@angular/cdk/bundles/cdk-platform.umd.js',
    '@angular/cdk/portal': 'node:@angular/cdk/bundles/cdk-portal.umd.js',
    '@angular/cdk/scrolling': 'node:@angular/cdk/bundles/cdk-scrolling.umd.js',
    '@angular/cdk/stepper': 'node:@angular/cdk/bundles/cdk-stepper.umd.js',
    '@angular/cdk/table': 'node:@angular/cdk/bundles/cdk-table.umd.js',
    '@angular/cdk/text-field': 'node:@angular/cdk/bundles/cdk-text-field.umd.js',
    '@angular/cdk/tree': 'node:@angular/cdk/bundles/cdk-tree.umd.js',
    '@angular/material': 'node:@angular/material/bundles/material.umd.js',
    '@angular/material/button': 'node:@angular/material/bundles/material-button.umd.js',
    '@angular/material/button-toggle':
        'node:@angular/material/bundles/material-button-toggle.umd.js',
    '@angular/material/card': 'node:@angular/material/bundles/material-card.umd.js',
    '@angular/material/checkbox': 'node:@angular/material/bundles/material-checkbox.umd.js',
    '@angular/material/core': 'node:@angular/material/bundles/material-core.umd.js',
    '@angular/material/dialog': 'node:@angular/material/bundles/material-dialog.umd.js',
    '@angular/material/divider': 'node:@angular/material/bundles/material-divider.umd.js',
    '@angular/material/expansion': 'node:@angular/material/bundles/material-expansion.umd.js',
    '@angular/material/form-field': 'node:@angular/material/bundles/material-form-field.umd.js',
    '@angular/material/grid-list': 'node:@angular/material/bundles/material-grid-list.umd.js',
    '@angular/material/icon': 'node:@angular/material/bundles/material-icon.umd.js',
    '@angular/material/input': 'node:@angular/material/bundles/material-input.umd.js',
    '@angular/material/list': 'node:@angular/material/bundles/material-list.umd.js',
    '@angular/material/menu': 'node:@angular/material/bundles/material-menu.umd.js',
    '@angular/material/paginator': 'node:@angular/material/bundles/material-paginator.umd.js',
    '@angular/material/progress-bar': 'node:@angular/material/bundles/material-progress-bar.umd.js',
    '@angular/material/radio': 'node:@angular/material/bundles/material-radio.umd.js',
    '@angular/material/select': 'node:@angular/material/bundles/material-select.umd.js',
    '@angular/material/sidenav': 'node:@angular/material/bundles/material-sidenav.umd.js',
    '@angular/material/slide-toggle': 'node:@angular/material/bundles/material-slide-toggle.umd.js',
    '@angular/material/slider': 'node:@angular/material/bundles/material-slider.umd.js',
    '@angular/material/snack-bar': 'node:@angular/material/bundles/material-snack-bar.umd.js',
    '@angular/material/sort': 'node:@angular/material/bundles/material-sort.umd.js',
    '@angular/material/table': 'node:@angular/material/bundles/material-table.umd.js',
    '@angular/material/tabs': 'node:@angular/material/bundles/material-tabs.umd.js',
    '@angular/material/toolbar': 'node:@angular/material/bundles/material-toolbar.umd.js',
    '@angular/material/tooltip': 'node:@angular/material/bundles/material-tooltip.umd.js',

    '@ngx-translate/core': 'node:@ngx-translate/core/bundles/ngx-translate-core.umd.js',
    '@ngx-translate/http-loader':
        'node:@ngx-translate/http-loader/bundles/ngx-translate-http-loader.umd.js',

    '@gngt/core': 'dist/packages/core/index.js',
    '@gngt/material': 'dist/packages/material/index.js',
    '@gngt/material-examples': 'dist/packages/material-examples/index.js',

    '@gngt/core/calendar': 'dist/packages/core/calendar/index.js',
    '@gngt/core/chart': 'dist/packages/core/chart/index.js',
    '@gngt/core/checkbox-group': 'dist/packages/core/checkbox-group/index.js',
    '@gngt/core/common': 'dist/packages/core/common/index.js',
    '@gngt/core/models': 'dist/packages/core/models/index.js',
    '@gngt/core/node-icon': 'dist/packages/core/node-icon/index.js',
    '@gngt/core/forms': 'dist/packages/core/forms/index.js',
    '@gngt/core/image': 'dist/packages/core/image/index.js',
    '@gngt/core/map': 'dist/packages/core/map/index.js',
    '@gngt/core/page-break': 'dist/packages/core/page-break/index.js',
    '@gngt/core/page-slider': 'dist/packages/core/page-slider/index.js',
    '@gngt/core/reports': 'dist/packages/core/reports/index.js',
    '@gngt/core/table': 'dist/packages/core/table/index.js',
    '@gngt/core/text': 'dist/packages/core/text/index.js',
    '@gngt/core/utils': 'dist/packages/core/utils/index.js',
    '@gngt/material/calendar': 'dist/packages/material/calendar/index.js',
    '@gngt/material/checkbox-group': 'dist/packages/material/checkbox-group/index.js',
    '@gngt/material/form-builder': 'dist/packages/material/form-builder/index.js',
    '@gngt/material/forms': 'dist/packages/material/forms/index.js',
    '@gngt/material/image': 'dist/packages/material/image/index.js',
    '@gngt/material/monaco-editor': 'dist/packages/material/monaco-editor/index.js',
    '@gngt/material/node-icon': 'dist/packages/material/node-icon/index.js',
    '@gngt/material/page-slider': 'dist/packages/material/page-slider/index.js',
    '@gngt/material/report-builder': 'dist/packages/material/report-builder/index.js',
    '@gngt/material/reports': 'dist/packages/material/reports/index.js',
    '@gngt/material/time': 'dist/packages/material/time/index.js',
  },
  packages: {
    // Set the default extension for the root package, because otherwise the dev-app can't
    // be built within the production mode. Due to missing file extensions.
    '.': {defaultExtension: 'js'}
  }
});
