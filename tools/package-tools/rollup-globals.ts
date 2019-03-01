import {join} from 'path';
import {getSubdirectoryNames} from './secondary-entry-points';
import {buildConfig} from './build-config';

/** Method that converts dash-case strings to a camel-based string. */
export const dashCaseToCamelCase =
  (str: string) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

/** Generates rollup entry point mappings for the given package and entry points. */
function generateRollupEntryPoints(packageName: string, entryPoints: string[]):
    {[k: string]: string} {
  return entryPoints.reduce((globals: {[k: string]: string}, entryPoint: string) => {
    globals[`@gngt/${packageName}/${entryPoint}`] =
        `gngt.${dashCaseToCamelCase(packageName)}.${dashCaseToCamelCase(entryPoint)}`;
    return globals;
  }, {});
}

/** List of potential secondary entry-points for the core package. */
const coreSecondaryEntryPoints = getSubdirectoryNames(join(buildConfig.packagesDir, 'core'));

/** List of potential secondary entry-points for the material package. */
const ionSecondaryEntryPoints = getSubdirectoryNames(join(buildConfig.packagesDir, 'ionic'));

/** List of potential secondary entry-points for the material package. */
const matSecondaryEntryPoints = getSubdirectoryNames(join(buildConfig.packagesDir, 'material'));

/** Object with all core entry points in the format of Rollup globals. */
const rollupCoreEntryPoints = generateRollupEntryPoints('core', coreSecondaryEntryPoints);

/** Object with all material entry points in the format of Rollup globals. */
const rollupIonEntryPoints = generateRollupEntryPoints('ionic', ionSecondaryEntryPoints);

/** Object with all material entry points in the format of Rollup globals. */
const rollupMatEntryPoints = generateRollupEntryPoints('material', matSecondaryEntryPoints);

/** Map of globals that are used inside of the different packages. */
export const rollupGlobals = {
  'date-fns': 'date-fns',
  'tslib': 'tslib',
  'url-parse': 'urlParse',

  '@angular/animations': 'ng.animations',
  '@angular/cdk': 'ng.cdk',
  '@angular/cdk/a11y': 'ng.cdk.a11y',
  '@angular/cdk/collections': 'ng.cdk.collections',
  '@angular/cdk/drag-drop': 'ng.cdk.drapDrop',
  '@angular/cdk/scrolling': 'ng.cdk.scrolling',
  '@angular/cdk/table': 'ng.cdk.table',
  '@angular/cdk/tree': 'ng.cdk.tree',
  '@angular/common': 'ng.common',
  '@angular/common/http': 'ng.common.http',
  '@angular/common/http/testing': 'ng.common.http.testing',
  '@angular/common/testing': 'ng.common.testing',
  '@angular/core': 'ng.core',
  '@angular/core/testing': 'ng.core.testing',
  '@angular/forms': 'ng.forms',
  '@angular/material': 'ng.material',
  '@angular/material/button': 'ng.material.button',
  '@angular/material/card': 'ng.material.card',
  '@angular/material/checkbox': 'ng.material.checkbox',
  '@angular/material/dialog': 'ng.material.dialog',
  '@angular/material/form-field': 'ng.material.formField',
  '@angular/material/icon': 'ng.material.icon',
  '@angular/material/input': 'ng.material.input',
  '@angular/material/paginator': 'ng.material.paginator',
  '@angular/material/progress-bar': 'ng.material.progressBar',
  '@angular/material/radio': 'ng.material.radio',
  '@angular/material/snack-bar': 'ng.material.snackBar',
  '@angular/material/select': 'ng.material.select',
  '@angular/material/sort': 'ng.material.sort',
  '@angular/material/table': 'ng.material.table',
  '@angular/material/toolbar': 'ng.material.toolbar',
  '@angular/platform-browser': 'ng.platformBrowser',
  '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
  '@angular/platform-browser-dynamic/testing': 'ng.platformBrowserDynamic.testing',
  '@angular/platform-browser/animations': 'ng.platformBrowser.animations',
  '@angular/platform-server': 'ng.platformServer',
  '@angular/router': 'ng.router',

  '@ionic/angular': 'ionic.angular',

  '@ngx-translate/core': 'ngxt.core',
  '@ngx-translate/http-loader': 'ngxt.httpLoader',

  '@ngrx/effects': 'ngrx.effects',
  '@ngrx/store': 'ngrx.store',

  'pouchdb': 'pouchdb',
  'pouchdb-debug': 'pouchdb.debug',
  'pouchdb-find': 'pouchdb.find',

  // Some packages are not really needed for the UMD bundles, but for the missingRollupGlobals rule.
  '@gngt/core': 'gngt.core',
  '@gngt/material': 'gngt.material',

  // Include secondary entry-points of the core and material packages
  ...rollupCoreEntryPoints,
  ...rollupIonEntryPoints,
  ...rollupMatEntryPoints,

  'rxjs': 'rxjs',
  'rxjs/operators': 'rxjs.operators',
};
