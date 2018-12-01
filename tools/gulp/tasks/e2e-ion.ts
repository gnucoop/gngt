import {task} from 'gulp';
import {buildConfig, sequenceTask, watchFiles} from 'gngt-build-tools';
import {join} from 'path';
import {
  copyTask, execNodeTask, getActiveBrowserSyncInstance, ngcBuildTask, serverTask
} from '../util/task_helpers';

const {outputDir, packagesDir, projectDir} = buildConfig;

const appDir = join(packagesDir, 'e2e-app-ion');
const e2eTestDir = join(projectDir, 'e2e-ion');

/**
 * The output of the e2e app will preserve the directory structure because otherwise NGC is not
 * able to generate factory files for the release output and node modules.
 */
const outDir = join(outputDir, 'src/e2e-app-ion');

const PROTRACTOR_CONFIG_PATH = join(projectDir, 'test/protractor.ion.conf.js');
const tsconfigPath = join(appDir, 'tsconfig-build.json');

/** Builds and serves the e2e-app-ion and runs protractor once the e2e-app-ion is ready. */
task('e2e-ion', sequenceTask(
  [':test:protractor-ion:setup', 'serve:e2eapp-ion'],
  ':test:protractor-ion',
  ':serve:e2eapp-ion:stop'
));

/**
 * Builds and serves the e2e-app-ion and runs protractor when the app is ready. Re-runs protractor
 * when the app or tests change.
 */
task('e2e-ion:watch', sequenceTask(
  [':test:protractor-ion:setup', 'serve:e2eapp-ion'],
  [':test:protractor-ion', 'ionic:watch', ':e2e-ion:watch'],
));

/** Watches the e2e app and tests for changes and triggers a test rerun on change. */
task(':e2e-ion:watch', () => {
  watchFiles([join(appDir, '**/*.+(html|ts|css)'), join(e2eTestDir, '**/*.+(html|ts)')],
      [':e2e-ion:rerun']);
});

/** Updates the e2e app and runs the protractor tests. */
task(':e2e-ion:rerun', sequenceTask(
  'e2e-app-ion:copy-assets',
  'e2e-app-ion:build-ts',
  ':e2e-ion:reload',
  ':test:protractor-ion'
));

/** Triggers a reload of the e2e app. */
task(':e2e-ion:reload', () => {
  return getActiveBrowserSyncInstance().reload();
});

/** Task that builds the e2e-app-ion in AOT mode. */
task('e2e-app-ion:build', sequenceTask(
  'clean',
  [
    'core:build-release',
    'ionic:build-release',
    'ionic-examples:build-release'
  ],
  ['e2e-app-ion:copy-index-html', 'e2e-app-ion:build-ts']
));

/** Task that copies the e2e-app-ion index HTML file to the output. */
task('e2e-app-ion:copy-index-html', copyTask(join(appDir, 'index.html'), outDir));

/** Task that builds the TypeScript sources. Those are compiled inside of the dist folder. */
task('e2e-app-ion:build-ts', ngcBuildTask(tsconfigPath));

task(':watch:e2eapp-ion', () => {
  watchFiles(join(appDir, '**/*.ts'), ['e2e-app-ion:build']);
  watchFiles(join(appDir, '**/*.html'), ['e2e-app-ion:copy-assets']);
});

/** Ensures that protractor and webdriver are set up to run. */
task(':test:protractor-ion:setup', execNodeTask(
  // Disable download of the gecko selenium driver because otherwise the webdriver
  // manager queries GitHub for the latest version and will result in rate limit failures.
  'protractor', 'webdriver-manager', ['update', '--gecko', 'false']));

/** Runs protractor tests (assumes that server is already running. */
task(':test:protractor-ion', execNodeTask('protractor', [PROTRACTOR_CONFIG_PATH]));

/** Starts up the e2e app server and rewrites the HTTP requests to properly work with AOT. */
task(':serve:e2eapp-ion', serverTask(outDir, [
  // Rewrite each request for .ngfactory files which are outside of the e2e-app-ion to the
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
  { from: '^/[^.]+$', to: `/dist/src/e2e-app-ion/index.html`},
  { from: '^(.*)$', to: `/dist/src/e2e-app-ion/$1` },
]));

/** Terminates the e2e app server */
task(':serve:e2eapp-ion:stop', () => getActiveBrowserSyncInstance().exit());

/** Builds and serves the e2e app. */
task('serve:e2eapp-ion', sequenceTask('e2e-app-ion:build', ':serve:e2eapp-ion'));

/**
 * [Watch task] Builds and serves e2e app, rebuilding whenever the sources change.
 * This should only be used when running e2e tests locally.
 */
task('serve:e2eapp-ion:watch', ['serve:e2eapp-ion', 'material:watch', ':watch:e2eapp-ion']);
