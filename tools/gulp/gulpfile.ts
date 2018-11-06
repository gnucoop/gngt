import {createPackageBuildTasks} from 'gngt-build-tools';
import {
  corePackage,
  examplesPackage,
  materialPackage
} from './packages';

createPackageBuildTasks(corePackage);
createPackageBuildTasks(materialPackage);
createPackageBuildTasks(examplesPackage, ['build-examples-module']);

import './tasks/aot';
import './tasks/breaking-changes';
import './tasks/changelog';
import './tasks/ci';
import './tasks/clean';
import './tasks/coverage';
import './tasks/default';
import './tasks/development';
import './tasks/docs';
import './tasks/e2e';
import './tasks/example-module';
import './tasks/lint';
import './tasks/gngt-release';
import './tasks/payload';
import './tasks/unit-test';
import './tasks/universal';

import './tasks/publish/publish-task';
import './tasks/publish/sanity-checks';
import './tasks/publish/validate-release';
