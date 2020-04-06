/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Advanced JSON forms (gngt).
 *
 * Advanced JSON forms (gngt) is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * Advanced JSON forms (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
 * General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Advanced JSON forms (gngt).
 * If not, see http://www.gnu.org/licenses/.
 *
 */

/**
 * List of tests that should not run in the Angular component test suites. This should
 * be empty in the components repository, but the file will be overwritten if the framework
 * repository runs the Angular component test suites against the latest snapshots. This is
 * helpful because sometimes breaking changes that break individual tests land in the framework
 * repository. It should be possible to disable these tests until the component repository
 * migrated the broken tests.
 */
export const testBlocklist: {[testName: string]: Object} = {};
