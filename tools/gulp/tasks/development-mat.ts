import {task, dest} from 'gulp';
import {copyFileSync, removeSync} from 'fs-extra';
import {tsBuildTask, copyTask, serverTask} from '../util/task_helpers';
import {join} from 'path';
import {
  buildConfig,
  buildScssPipeline,
  copyFiles,
  inlineResourcesForDirectory,
  sequenceTask,
} from 'gngt-build-tools';
import {
  corePackage,
  materialPackage,
  matExamplesPackage,
} from '../packages';
import {watchFilesAndReload} from '../util/watch-files-reload';

// These imports don't have any typings provided.
const firebaseTools = require('firebase-tools');

const {outputDir, packagesDir, projectDir} = buildConfig;

/** Path to the directory where all bundles live. */
const bundlesDir = join(outputDir, 'bundles');

const appDir = join(packagesDir, 'demo-app-mat');
const outDir = join(outputDir, 'packages', 'demo-app-mat');

/** Array of vendors that are required to serve the demo-app-mat. */
const appVendors = [
  '@angular',
  '@ngrx',
  '@ngx-translate',
  'systemjs',
  'systemjs-plugin-babel',
  'zone.js',
  'rxjs',
  'hammerjs',
  'core-js',
  'date-fns',
  'tslib',
  'url-parse',
  '@webcomponents',
];

/** Glob that matches all required vendors for the demo-app-mat. */
const vendorGlob = `+(${appVendors.join('|')})/**/*.+(html|css|js|map)`;

/** Glob that matches all assets that need to be copied to the output. */
const assetsGlob = join(appDir, `**/*.+(html|css|svg|ico)`);

/** Path to the demo-app-mat tsconfig file. */
const tsconfigPath = join(appDir, 'tsconfig-build.json');

const firebaseSrcConfig = join(projectDir, 'firebase-mat.json');
const firebaseDstConfig = join(projectDir, 'firebase.json');

task(':build:devapp-mat:ts', tsBuildTask(tsconfigPath));
task(':build:devapp-mat:assets', copyTask(assetsGlob, outDir));
task(':build:devapp-mat:scss', () => buildScssPipeline(appDir).pipe(dest(outDir)));
task(':build:devapp-mat:inline-resources', () => inlineResourcesForDirectory(outDir));

task(':serve:devapp-mat', serverTask(outDir));

task('build:devapp-mat', sequenceTask(
  'core:build-no-bundles',
  'material:build-no-bundles',
  'build-mat-examples-module',
  // The examples module needs to be manually built before building examples package because
  // when using the `no-bundles` task, the package-specific pre-build tasks won't be executed.
  'material-examples:build-no-bundles',
  [':build:devapp-mat:assets', ':build:devapp-mat:scss', ':build:devapp-mat:ts'],
  // Inline all component resources because otherwise SystemJS tries to load HTML, CSS and
  // JavaScript files which makes loading the demo-app-mat extremely slow.
  ':build:devapp-mat:inline-resources',
));

task('serve:devapp-mat', ['build:devapp-mat'],
  sequenceTask([':serve:devapp-mat', ':watch:devapp-mat']));

/*
 * Development App deployment tasks. These can be used to run the dev-app outside of our
 * serve task with a middleware. e.g. on Firebase hosting.
 */

/**
 * Task that copies all vendors into the demo-app-mat package. Allows hosting the app on firebase.
 */
task('stage-deploy:devapp-mat', ['build:devapp-mat'], () => {
  copyFiles(join(projectDir, 'node_modules'), vendorGlob, join(outDir, 'node_modules'));
  copyFiles(bundlesDir, '*.+(js|map)', join(outDir, 'dist/bundles'));
  copyFiles(corePackage.outputDir, '**/*.+(js|map)', join(outDir, 'dist/packages/core'));
  copyFiles(materialPackage.outputDir, '**/*.+(js|map)', join(outDir, 'dist/packages/material'));
  copyFiles(materialPackage.outputDir, '**/prebuilt/*.+(css|map)',
      join(outDir, 'dist/packages/material'));
  copyFiles(matExamplesPackage.outputDir, '**/*.+(js|map)',
      join(outDir, 'dist/packages/material-examples'));
  copyFileSync(firebaseSrcConfig, firebaseDstConfig);
});

/**
 * Task that deploys the demo-app-mat to Firebase. Firebase project will be the one that is
 * set for project directory using the Firebase CLI.
 */
task('deploy:devapp-mat', ['stage-deploy:devapp-mat'], () => {
  return firebaseTools.deploy({cwd: projectDir, project: 'material-staging', only: 'hosting'})
    // Firebase tools opens a persistent websocket connection and the process will never exit.
    .then(() => {
      removeSync(firebaseDstConfig);
      console.log('Successfully deployed the demo-app-mat to firebase');
      process.exit(0);
    })
    .catch((err: any) => {
      removeSync(firebaseDstConfig);
      console.log(err);
      process.exit(1);
    });
});

/*
 * Development app watch task. This task ensures that only the packages that have been affected
 * by a file-change are being rebuilt. This speeds-up development and makes working on Gngt
 * easier.
 */

task(':watch:devapp-mat', () => {
  watchFilesAndReload(join(appDir, '**/*.ts'), [':build:devapp-mat:ts']);
  watchFilesAndReload(join(appDir, '**/*.scss'), [':watch:devapp-mat:rebuild-scss']);
  watchFilesAndReload(join(appDir, '**/*.html'), [':watch:devapp-mat:rebuild-html']);

  // Custom watchers for all packages that are used inside of the demo-app-mat. This is necessary
  // because we only want to build the changed package (using the build-no-bundles task).

  // Core package watchers.
  watchFilesAndReload(join(corePackage.sourceDir, '**/*'), ['core:build-no-bundles']);

  const materialCoreThemingGlob = join(materialPackage.sourceDir, '**/core/theming/**/*.scss');

  // Material package watchers.
  watchFilesAndReload([
    join(materialPackage.sourceDir, '**/!(*-theme.scss)'), `!${materialCoreThemingGlob}`
  ], ['material:build-no-bundles']);
  watchFilesAndReload([
    join(materialPackage.sourceDir, '**/*-theme.scss'), materialCoreThemingGlob
  ], [':build:devapp-mat:scss']);

  // Example package watchers.
  watchFilesAndReload(join(matExamplesPackage.sourceDir, '**/*'),
    ['material-examples:build-no-bundles']);
});

// Note that we need to rebuild the TS here, because the resource inlining
// won't work if the file's resources have been inlined already.
task(':watch:devapp-mat:rebuild-scss',
  sequenceTask([':build:devapp-mat:scss', ':build:devapp-mat:ts'],
   ':build:devapp-mat:inline-resources'));

task(':watch:devapp-mat:rebuild-html',
  sequenceTask([':build:devapp-mat:assets', ':build:devapp-mat:ts'],
  ':build:devapp-mat:inline-resources'));
