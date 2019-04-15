import {task, dest, src} from 'gulp';
import {noop} from 'gulp-util';
import {
  copyFileSync, existsSync, mkdirpSync, readFileSync, removeSync, writeFileSync
} from 'fs-extra';
import * as webpack from 'webpack-stream';
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
  ionicPackage,
  ionExamplesPackage,
} from '../packages';
import {watchFilesAndReload} from '../util/watch-files-reload';

// These imports don't have any typings provided.
const firebaseTools = require('firebase-tools');

const {outputDir, packagesDir, projectDir} = buildConfig;

/** Path to the directory where all bundles live. */
const bundlesDir = join(outputDir, 'bundles');

const appDir = join(packagesDir, 'dev-app-ion');
const outDir = join(outputDir, 'packages', 'dev-app-ion');

/** Array of vendors that are required to serve the dev-app-ion. */
const appVendors = [
  '@angular',
  '@ionic',
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

/** Glob that matches all required vendors for the dev-app-ion. */
const vendorGlob = `+(${appVendors.join('|')})/**/*.+(html|css|js|map)`;

/** Glob that matches all assets that need to be copied to the output. */
const assetsGlob = join(appDir, `**/*.+(html|css|svg|ico)`);

/** Path to the dev-app-ion tsconfig file. */
const tsconfigPath = join(appDir, 'tsconfig-build.json');

const firebaseSrcConfig = join(projectDir, 'firebase-ion.json');
const firebaseDstConfig = join(projectDir, 'firebase.json');

task(':build:devapp-ion:ts', tsBuildTask(tsconfigPath));
task(':build:devapp-ion:assets', copyTask(assetsGlob, outDir));
task(':build:devapp-ion:scss', () => buildScssPipeline(appDir).pipe(dest(outDir)));
task(':build:devapp-ion:inline-resources', () => inlineResourcesForDirectory(outDir));

task(':build:gic-bundle', () => {
  const bundlesOutDir = join(projectDir, 'bundles');
  const gicEntry = join('node_modules', '@gic', 'angular', 'dist', 'fesm5.js');
  const gicBundleFile = 'gic-angular.umd.js';
  const gicBundle = join(bundlesOutDir, gicBundleFile);
  let stream = src(join(projectDir, gicEntry));
  if (existsSync(gicBundle)) {
    stream = stream.pipe(noop());
  } else {
    const nodeModulesDir = 'node_modules';
    const externals = [
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/router',
      '@ionic/angular',
      '@ionic/core',
      'tslib',
      'rxjs',
    ].map(e => `"${e}"`);
    const configSrc = readFileSync(join(projectDir, 'tools', 'webpack.bundle.config.js'))
      .toString()
      .replace('TMPL_entry', `"${gicEntry}"`)
      .replace('TMPL_library', '"@gic/angular"')
      .replace('TMPL_library_target', '"umd"')
      .replace('TMPL_output_path', `"${bundlesOutDir}"`)
      .replace('TMPL_output_filename', `"${gicBundleFile}"`)
      .replace('TMPL_externals', `[${externals.join(', ')}]`)
      .replace('TMPL_node_modules_root', `"${nodeModulesDir}"`);
    const configDst = join(bundlesOutDir, 'webpack.gic.config.js');
    if (!existsSync(bundlesOutDir)) {
      mkdirpSync(bundlesOutDir);
    }
    writeFileSync(configDst, configSrc);
    const config = require(configDst);
    stream = stream
      .pipe(webpack(config))
      .pipe(dest(bundlesOutDir));
  }
  return stream;
});

task(':build:ionic-bundle', () => {
  const bundlesOutDir = join(projectDir, 'bundles');
  const ionicEntry = join('node_modules', '@ionic', 'angular', 'dist', 'fesm5.js');
  const ionicBundleFile = 'ionic-angular.umd.js';
  const ionicBundle = join(bundlesOutDir, ionicBundleFile);
  let stream = src(join(projectDir, ionicEntry));
  if (existsSync(ionicBundle)) {
    stream = stream.pipe(noop());
  } else {
    const nodeModulesDir = 'node_modules';
    const externals = [
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/router',
      'tslib',
      'rxjs',
    ].map(e => `"${e}"`);
    const configSrc = readFileSync(join(projectDir, 'tools', 'webpack.bundle.config.js'))
      .toString()
      .replace('TMPL_entry', `"${ionicEntry}"`)
      .replace('TMPL_library', '"@ionic/angular"')
      .replace('TMPL_library_target', '"umd"')
      .replace('TMPL_output_path', `"${bundlesOutDir}"`)
      .replace('TMPL_output_filename', `"${ionicBundleFile}"`)
      .replace('TMPL_externals', `[${externals.join(', ')}]`)
      .replace('TMPL_node_modules_root', `"${nodeModulesDir}"`);
    const configDst = join(bundlesOutDir, 'webpack.ionic.config.js');
    if (!existsSync(bundlesOutDir)) {
      mkdirpSync(bundlesOutDir);
    }
    writeFileSync(configDst, configSrc);
    const config = require(configDst);
    stream = stream
      .pipe(webpack(config))
      .pipe(dest(bundlesOutDir));
  }
  return stream;
});

task(':serve:devapp-ion', serverTask(outDir));

task('build:devapp-ion', sequenceTask(
  'core:build-no-bundles',
  'ionic:build-no-bundles',
  'build-ion-examples-module',
  // The examples module needs to be manually built before building examples package because
  // when using the `no-bundles` task, the package-specific pre-build tasks won't be executed.
  'ionic-examples:build-no-bundles',
  [
    ':build:devapp-ion:assets', ':build:devapp-ion:scss',
    ':build:devapp-ion:ts', ':build:ionic-bundle', ':build:gic-bundle',
  ],
  // Inline all component resources because otherwise SystemJS tries to load HTML, CSS and
  // JavaScript files which makes loading the dev-app-ion extremely slow.
  ':build:devapp-ion:inline-resources',
));

task('serve:devapp-ion', ['build:devapp-ion'],
  sequenceTask([':serve:devapp-ion', ':watch:devapp-ion']));

/*
 * Development App deployment tasks. These can be used to run the dev-app outside of our
 * serve task with a middleware. e.g. on Firebase hosting.
 */

/**
 * Task that copies all vendors into the dev-app-ion package. Allows hosting the app on firebase.
 */
task('stage-deploy:devapp-ion', ['build:devapp-ion'], () => {
  copyFiles(join(projectDir, 'node_modules'), vendorGlob, join(outDir, 'node_modules'));
  copyFiles(bundlesDir, '*.+(js|map)', join(outDir, 'dist/bundles'));
  copyFiles(corePackage.outputDir, '**/*.+(js|map)', join(outDir, 'dist/packages/core'));
  copyFiles(ionicPackage.outputDir, '**/*.+(js|map)', join(outDir, 'dist/packages/ionic'));
  copyFiles(ionicPackage.outputDir, '**/prebuilt/*.+(css|map)',
      join(outDir, 'dist/packages/ionic'));
  copyFiles(ionExamplesPackage.outputDir, '**/*.+(js|map)',
      join(outDir, 'dist/packages/ionic-examples'));
  copyFileSync(firebaseSrcConfig, firebaseDstConfig);
});

/**
 * Task that deploys the dev-app-ion to Firebase. Firebase project will be the one that is
 * set for project directory using the Firebase CLI.
 */
task('deploy:devapp-ion', ['stage-deploy:devapp-ion'], () => {
  return firebaseTools.deploy({cwd: projectDir, project: 'ionic-staging', only: 'hosting'})
    // Firebase tools opens a persistent websocket connection and the process will never exit.
    .then(() => {
      removeSync(firebaseDstConfig);
      console.log('Successfully deployed the dev-app-ion to firebase');
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

task(':watch:devapp-ion', () => {
  watchFilesAndReload(join(appDir, '**/*.ts'), [':build:devapp-ion:ts']);
  watchFilesAndReload(join(appDir, '**/*.scss'), [':watch:devapp-ion:rebuild-scss']);
  watchFilesAndReload(join(appDir, '**/*.html'), [':watch:devapp-ion:rebuild-html']);

  // Custom watchers for all packages that are used inside of the dev-app-ion. This is necessary
  // because we only want to build the changed package (using the build-no-bundles task).

  // Core package watchers.
  watchFilesAndReload(join(corePackage.sourceDir, '**/*'), ['core:build-no-bundles']);

  const ionicCoreThemingGlob = join(ionicPackage.sourceDir, '**/core/theming/**/*.scss');

  // Ionic package watchers.
  watchFilesAndReload([
    join(ionicPackage.sourceDir, '**/!(*-theme.scss)'), `!${ionicCoreThemingGlob}`
  ], ['ionic:build-no-bundles']);
  watchFilesAndReload([
    join(ionicPackage.sourceDir, '**/*-theme.scss'), ionicCoreThemingGlob
  ], [':build:devapp-ion:scss']);

  // Example package watchers.
  watchFilesAndReload(join(ionExamplesPackage.sourceDir, '**/*'),
    ['ionic-examples:build-no-bundles']);
});

// Note that we need to rebuild the TS here, because the resource inlining
// won't work if the file's resources have been inlined already.
task(':watch:devapp-ion:rebuild-scss',
  sequenceTask([':build:devapp-ion:scss', ':build:devapp-ion:ts'],
   ':build:devapp-ion:inline-resources'));

task(':watch:devapp-ion:rebuild-html',
  sequenceTask([':build:devapp-ion:assets', ':build:devapp-ion:ts'],
    ':build:devapp-ion:inline-resources'));
