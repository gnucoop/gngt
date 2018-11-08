import {task} from 'gulp';
import {buildConfig, sequenceTask, triggerLivereload, watchFiles} from 'gngt-build-tools';
import {join} from 'path';
import {copyTask, execNodeTask, ngcBuildTask, serverTask} from '../util/task_helpers';

// There are no type definitions available for these imports.
const gulpConnect = require('gulp-connect');

const {outputDir, packagesDir, projectDir} = buildConfig;

const appDir = join(packagesDir, 'e2e-app-mat');
const e2eTestDir = join(projectDir, 'e2e-mat');

/**
 * The output of the e2e app will preserve the directory structure because otherwise NGC is not
 * able to generate factory files for the release output and node modules.
 */
const outDir = join(outputDir, 'src/e2e-app-mat');

const PROTRACTOR_CONFIG_PATH = join(projectDir, 'test/protractor.mat.conf.js');
const tsconfigPath = join(appDir, 'tsconfig-build.json');

/** Builds and serves the e2e-app-mat and runs protractor once the e2e-app-mat is ready. */
task('e2e-mat', sequenceTask(
  [':test:protractor-mat:setup', 'serve:e2eapp-mat'],
  ':test:protractor-mat',
  ':serve:e2eapp-mat:stop'
));

/**
 * Builds and serves the e2e-app-mat and runs protractor when the app is ready. Re-runs protractor
 * when the app or tests change.
 */
task('e2e-mat:watch', sequenceTask(
  [':test:protractor-mat:setup', 'serve:e2eapp-mat'],
  [':test:protractor-mat', 'material:watch', ':e2e-mat:watch'],
));

/** Watches the e2e app and tests for changes and triggers a test rerun on change. */
task(':e2e-mat:watch', () => {
  watchFiles([join(appDir, '**/*.+(html|ts|css)'), join(e2eTestDir, '**/*.+(html|ts)')],
      [':e2e-mat:rerun'], false);
});

/** Updates the e2e app and runs the protractor tests. */
task(':e2e-mat:rerun', sequenceTask(
  'e2e-app-mat:copy-assets',
  'e2e-app-mat:build-ts',
  ':e2e-mat:reload',
  ':test:protractor-mat'
));

/** Triggers a reload of the e2e app. */
task(':e2e-mat:reload', () => {
  return triggerLivereload();
});

/** Task that builds the e2e-app-mat in AOT mode. */
task('e2e-app-mat:build', sequenceTask(
  'clean',
  [
    'core:build-release',
    'material:build-release',
    'material-examples:build-release'
  ],
  ['e2e-app-mat:copy-index-html', 'e2e-app-mat:build-ts']
));

/** Task that copies the e2e-app-mat index HTML file to the output. */
task('e2e-app-mat:copy-index-html', copyTask(join(appDir, 'index.html'), outDir));

/** Task that builds the TypeScript sources. Those are compiled inside of the dist folder. */
task('e2e-app-mat:build-ts', ngcBuildTask(tsconfigPath));

task(':watch:e2eapp-mat', () => {
  watchFiles(join(appDir, '**/*.ts'), ['e2e-app-mat:build'], false);
  watchFiles(join(appDir, '**/*.html'), ['e2e-app-mat:copy-assets'], false);
});

/** Ensures that protractor and webdriver are set up to run. */
task(':test:protractor-mat:setup', execNodeTask(
  // Disable download of the gecko selenium driver because otherwise the webdriver
  // manager queries GitHub for the latest version and will result in rate limit failures.
  'protractor', 'webdriver-manager', ['update', '--gecko', 'false']));

/** Runs protractor tests (assumes that server is already running. */
task(':test:protractor-mat', execNodeTask('protractor', [PROTRACTOR_CONFIG_PATH]));

/** Starts up the e2e app server and rewrites the HTTP requests to properly work with AOT. */
task(':serve:e2eapp-mat', serverTask(outDir, false, [
  // Rewrite each request for .ngfactory files which are outside of the e2e-app-mat to the
  // **actual** path. This is necessary because NGC cannot generate factory files for the node
  // modules and release output. If we work around it by adding multiple root directories, the
  // directory structure would be messed up, so we need to go this way for now (until Ivy).
  { from: '^/((?:dist|node_modules)/.*\.ngfactory\.js)$', to: '/dist/$1' },
  // Rewrite the node_modules/ and dist/ folder to the real paths. Otherwise we would need
  // to copy the required modules to the serve output. If dist/ is explicitly requested, we
  // should redirect to the actual dist path because by default we fall back to the e2e output.
  { from: '^/node_modules/(.*)$', to: '/node_modules/$1' },
  { from: '^/dist/(.*)$', to: '/dist/$1' },
  // Rewrite every path that doesn't point to a specific file to the e2e output.
  // This is necessary for Angular's routing using the HTML5 History API.
  { from: '^/[^.]+$', to: `/dist/src/e2e-app-mat/index.html`},
  { from: '^(.*)$', to: `/dist/src/e2e-app-mat/$1` },
]));

/** Terminates the e2e app server */
task(':serve:e2eapp-mat:stop', gulpConnect.serverClose);

/** Builds and serves the e2e app. */
task('serve:e2eapp-mat', sequenceTask('e2e-app-mat:build', ':serve:e2eapp-mat'));

/**
 * [Watch task] Builds and serves e2e app, rebuilding whenever the sources change.
 * This should only be used when running e2e tests locally.
 */
task('serve:e2eapp-mat:watch', ['serve:e2eapp-mat', 'material:watch', ':watch:e2eapp-mat']);
