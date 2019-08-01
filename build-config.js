/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of Gngt.
 */
const {join} = require('path');

const packageJson = require('./package.json');

/** Current version of the project*/
const buildVersion = packageJson.version;

/**
 * Required Angular version for all Gngt packages. This version will be used
 * as the peer dependency version for Angular in all release packages.
 */
const angularVersion = packageJson.requiredAngularVersion;

const angularMaterialVersion = packageJson.requiredAngularMaterialVersion;
const ngrxVersion = packageJson.requiredNgrxVersion;
const ngxtVersion = packageJson.requiredNgxtVersion;
const ionicVersion = packageJson.requiredIonicVersion;
const gicVersion = packageJson.requiredGicVersion;

/** License that will be placed inside of all created bundles. */
const buildLicense = `/**
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
 */`;

module.exports = {
  projectVersion: buildVersion,
  angularVersion: angularVersion,
  angularMaterialVersion: angularMaterialVersion,
  ngrxVersion: ngrxVersion,
  ngxtVersion: ngxtVersion,
  ionicVersion: ionicVersion,
  gicVersion: gicVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'src'),
  outputDir: join(__dirname, 'dist'),
  licenseBanner: buildLicense
};
