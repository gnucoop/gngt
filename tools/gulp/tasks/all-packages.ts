import {task} from 'gulp';
import {sequenceTask} from 'gngt-build-tools';

const allPackages = ['core', 'ionic', 'material'];

task('gngt:clean-build', sequenceTask('clean', ...allPackages.map(p => `${p}:build-no-deps`)));
