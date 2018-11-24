/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask, RunSchematicTask} from '@angular-devkit/schematics/tasks';
import {addPackageToPackageJson} from './package-config';
import {Schema} from './schema';
import * as versionNames from './version-names';

/**
 * Schematic factory entry-point for the `ng-add` schematic. The ng-add schematic will be
 * automatically executed if developers run `ng add @gngt/core`.
 */
export default function(options: Schema): Rule {
  return (host: Tree, context: SchematicContext) => {
    addPackageToPackageJson(host, '@angular/cdk',
      `~${versionNames.requiredAngularMaterialVersion}`);

    addPackageToPackageJson(host, '@gngt/core', `~${versionNames.gngtVersion}`);

    addPackageToPackageJson(host, '@ngrx/effects', `~${versionNames.requiredNgrxVersion}`);
    addPackageToPackageJson(host, '@ngrx/store', `~${versionNames.requiredNgrxVersion}`);

    addPackageToPackageJson(host, '@ngx-translate/core', `~${versionNames.requiredNgxtVersion}`);

    addPackageToPackageJson(host, 'url-parse', `${versionNames.requiredUrlParseVersion}`);

    const installTaskId = context.addTask(new NodePackageInstallTask());

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
  };
}
