import {createPackageBuildTasks} from 'gngt-build-tools';
import {
  corePackage,
  matExamplesPackage,
  materialPackage,
  ionExamplesPackage,
  ionicPackage
} from './packages';

createPackageBuildTasks(corePackage);
createPackageBuildTasks(materialPackage);
createPackageBuildTasks(matExamplesPackage, ['build-mat-examples-module']);
createPackageBuildTasks(ionicPackage);
createPackageBuildTasks(ionExamplesPackage, ['build-ion-examples-module']);

import './tasks/all-packages';
import './tasks/aot-ion';
import './tasks/aot-mat';
import './tasks/breaking-changes';
import './tasks/changelog';
import './tasks/ci';
import './tasks/clean';
import './tasks/coverage';
import './tasks/default';
import './tasks/development-ion';
import './tasks/development-mat';
import './tasks/docs';
import './tasks/e2e-ion';
import './tasks/e2e-mat';
import './tasks/example-module-mat';
import './tasks/example-module-ion';
import './tasks/lint';
import './tasks/gngt-release';
import './tasks/payload';
import './tasks/unit-test';
import './tasks/universal-ion';
import './tasks/universal-mat';

import './tasks/publish/publish-task';
import './tasks/publish/sanity-checks';
import './tasks/publish/validate-release';
