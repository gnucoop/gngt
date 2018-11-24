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

import {Tree} from '@angular-devkit/schematics';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: object) {
  return Object.keys(obj).sort().reduce((result, key) => (result[key] = obj[key]) && result, {});
}

/** Adds a package to the package.json in the given host tree. */
export function addPackageToPackageJson(host: Tree, pkg: string, version: string): Tree {

  if (host.exists('package.json')) {
    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.dependencies) {
      json.dependencies = {};
    }

    if (!json.dependencies[pkg]) {
      json.dependencies[pkg] = version;
      json.dependencies = sortObjectByKeys(json.dependencies);
    }

    host.overwrite('package.json', JSON.stringify(json, null, 2));
  }

  return host;
}

/** Gets the version of the specified package by looking at the package.json in the given tree. */
export function getPackageVersionFromPackageJson(tree: Tree, name: string): string | null {
  if (!tree.exists('package.json')) {
    return null;
  }

  const packageJson = JSON.parse(tree.read('package.json')!.toString('utf8'));

  if (packageJson.dependencies && packageJson.dependencies[name]) {
    return packageJson.dependencies[name];
  }

  return null;
}
