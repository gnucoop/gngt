import {createPackageBuildTasks} from '../package-tools';
import {
  corePackage,
  ionicPackage,
  materialPackage,
} from './packages';

// Build tasks have to be imported first, because the other tasks depend on them.
createPackageBuildTasks(corePackage);
createPackageBuildTasks(ionicPackage);
createPackageBuildTasks(materialPackage);

import './tasks/clean';
import './tasks/unit-test';
import './tasks/ci';
