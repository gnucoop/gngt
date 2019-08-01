import {dest, task} from 'gulp';
import {ngcBuildTask, tsBuildTask, copyTask, execTask} from '../util/task-helpers';
import {join} from 'path';
import {copySync} from 'fs-extra';
import {buildConfig, buildScssPipeline, sequenceTask} from 'gngt-build-tools';

const {outputDir, packagesDir} = buildConfig;

/** Path to the directory where all releases are created. */
const releasesDir = join(outputDir, 'releases');

const appDir = join(packagesDir, 'universal-app-ion');
const outDir = join(outputDir, 'packages', 'universal-app-ion');

// Paths to the different tsconfig files of the Universal app.
// Building the sources in the output directory is part of the workaround for
// https://github.com/angular/angular/issues/12249
const tsconfigAppPath = join(outDir, 'tsconfig-build.json');
const tsconfigPrerenderPath = join(outDir, 'tsconfig-prerender.json');

/** Path to the compiled prerender file. Running this file just dumps the HTML output for now. */
const prerenderOutFile = join(outDir, 'prerender.js');

/** Task that builds the universal-app-ion and runs the prerender script. */
task('prerender-ion', ['universal-ion:build'], execTask(
  // Runs node with the tsconfig-paths module to alias the @gngt/ionic dependency.
  'node', ['-r', 'tsconfig-paths/register', prerenderOutFile], {
    env: {TS_NODE_PROJECT: tsconfigPrerenderPath},
    // Errors in lifecycle hooks will write to STDERR, but won't exit the process with an
    // error code, however we still want to catch those cases in the CI.
    failOnStderr: true
  }
));

task('universal-ion:build', sequenceTask(
  'clean',
  ['ionic:build-release', 'core:build-release'],
  ['universal-ion:copy-release', 'universal-ion:copy-files'],
  ['universal-ion:build-app-ts', 'universal-ion:build-app-scss'],
  'universal-ion:build-prerender-ts',
));

/** Task that builds the universal app in the output directory. */
task('universal-ion:build-app-ts', ngcBuildTask(tsconfigAppPath));

/** Task that builds the universal app styles in the output directory. */
task('universal-ion:build-app-scss', () => buildScssPipeline(appDir).pipe(dest(outDir)));

/** Task that copies all files to the output directory. */
task('universal-ion:copy-files', copyTask(appDir, outDir));

/** Task that builds the prerender script in the output directory. */
task('universal-ion:build-prerender-ts', tsBuildTask(tsconfigPrerenderPath));

// As a workaround for https://github.com/angular/angular/issues/12249, we need to
// copy the Ionic and Core ESM output inside of the universal-app-ion output.
task('universal-ion:copy-release', () => {
  copySync(join(releasesDir, 'ionic'), join(outDir, 'ionic'));
  copySync(join(releasesDir, 'core'), join(outDir, 'core'));
});
