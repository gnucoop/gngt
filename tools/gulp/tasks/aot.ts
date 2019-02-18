import {task} from 'gulp';
import {sequenceTask} from 'gngt-build-tools';

task('build-aot:release-packages', sequenceTask(
  'gngt:build-release',
  [
    'ionic-examples:build-release',
    'material-examples:build-release',
  ],
));
