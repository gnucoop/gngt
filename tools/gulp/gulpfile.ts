import {createPackageBuildTasks} from '../package-tools';
import {
  corePackage,
  ionicPackage,
  materialPackage,
} from './packages';

import './tasks/ci';
import './tasks/clean';
import './tasks/unit-test';

createPackageBuildTasks(corePackage);
createPackageBuildTasks(ionicPackage);
createPackageBuildTasks(materialPackage);
