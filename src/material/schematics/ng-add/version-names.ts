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

/** Name of the Gngt version that is shipped together with the schematics. */
export const gngtVersion =
  loadPackageVersionGracefully('@gngt/core') ||
  loadPackageVersionGracefully('@gngt/ionic') ||
  loadPackageVersionGracefully('@gngt/material');

/**
 * Range of Angular versions that can be used together with the Gngt Material version
 * that provides these schematics.
 */
export const requiredAngularVersionRange = '0.0.0-NG';

/** Loads the full version from the given Angular package gracefully. */
function loadPackageVersionGracefully(packageName: string): string | null {
  try {
    return require(`${packageName}/package.json`).version;
  } catch {
    return null;
  }
}
