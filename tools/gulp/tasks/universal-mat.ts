import {dest, task} from 'gulp';
import {ngcBuildTask, tsBuildTask, copyTask, execTask} from '../util/task_helpers';
import {join} from 'path';
import {copySync} from 'fs-extra';
import {buildConfig, buildScssPipeline, sequenceTask} from 'gngt-build-tools';

const {outputDir, packagesDir} = buildConfig;

/** Path to the directory where all releases are created. */
const releasesDir = join(outputDir, 'releases');

const appDir = join(packagesDir, 'universal-app-mat');
const outDir = join(outputDir, 'packages', 'universal-app-mat');

// Paths to the different tsconfig files of the Universal app.
// Building the sources in the output directory is part of the workaround for
// https://github.com/angular/angular/issues/12249
const tsconfigAppPath = join(outDir, 'tsconfig-build.json');
const tsconfigPrerenderPath = join(outDir, 'tsconfig-prerender.json');

/** Path to the compiled prerender file. Running this file just dumps the HTML output for now. */
const prerenderOutFile = join(outDir, 'prerender.js');

/** Task that builds the universal-app-mat and runs the prerender script. */
task('prerender-mat', ['universal-mat:build'], execTask(
  // Runs node with the tsconfig-paths module to alias the @gngt/material dependency.
  'node', ['-r', 'tsconfig-paths/register', prerenderOutFile], {
    env: {TS_NODE_PROJECT: tsconfigPrerenderPath},
    // Errors in lifecycle hooks will write to STDERR, but won't exit the process with an
    // error code, however we still want to catch those cases in the CI.
    failOnStderr: true
  }
));

task('universal-mat:build', sequenceTask(
  'clean',
  ['material:build-release', 'core:build-release'],
  ['universal-mat:copy-release', 'universal-mat:copy-files'],
  ['universal-mat:build-app-ts', 'universal-mat:build-app-scss'],
  'universal-mat:build-prerender-ts',
));

/** Task that builds the universal app in the output directory. */
task('universal-mat:build-app-ts', ngcBuildTask(tsconfigAppPath));

/** Task that builds the universal app styles in the output directory. */
task('universal-mat:build-app-scss', () => buildScssPipeline(appDir).pipe(dest(outDir)));

/** Task that copies all files to the output directory. */
task('universal-mat:copy-files', copyTask(appDir, outDir));

/** Task that builds the prerender script in the output directory. */
task('universal-mat:build-prerender-ts', tsBuildTask(tsconfigPrerenderPath));

// As a workaround for https://github.com/angular/angular/issues/12249, we need to
// copy the Material and Core ESM output inside of the universal-app-mat output.
task('universal-mat:copy-release', () => {
  copySync(join(releasesDir, 'material'), join(outDir, 'material'));
  copySync(join(releasesDir, 'core'), join(outDir, 'core'));
});
