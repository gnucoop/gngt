import {task} from 'gulp';
import {execNodeTask} from '../util/task_helpers';
import {join} from 'path';
import {buildConfig, sequenceTask} from 'gngt-build-tools';

const {packagesDir} = buildConfig;

/** Path to the dev-app-ion source directory. */
const devApppSource = join(packagesDir, 'dev-app-ion');

/** Path to the tsconfig file that builds the AOT files. */
const tsconfigFile = join(devApppSource, 'tsconfig-aot.json');

/**
 * Build the dev-app-ion with the release output in order confirm that the library is
 * working with AOT compilation enabled.
 */
task('build-aot-ion', sequenceTask(
  'clean',
  ['build-aot-ion:release-packages', 'build-aot-ion:assets'],
  'build-aot-ion:compiler-cli'
));

/**
 * Task that can be used to build the dev-app-ion with AOT without building the
 * release output. This can be run if the release output is already built.
 */
task('build-aot-ion:no-release-build',
  sequenceTask('build-aot-ion:assets', 'build-aot-ion:compiler-cli'));

/** Builds the dev-app-ion assets and builds the required release packages. */
task('build-aot-ion:release-packages', sequenceTask(
  [
    'core:build-release',
    'ionic:build-release',
    'ionic-examples:build-release',
  ],
));

/**
 * Task that builds the assets which are required for building with AOT. Since the dev-app-ion uses
 * Sass files, we need to provide the transpiled CSS sources in the package output.
 */
task('build-aot-ion:assets', [':build:devapp-ion:assets', ':build:devapp-ion:scss']);

/** Build the dev-app-ion and a release to confirm that the library is AOT-compatible. */
task('build-aot-ion:compiler-cli', execNodeTask(
  '@angular/compiler-cli', 'ngc', ['-p', tsconfigFile]
));
