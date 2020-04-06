/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

// Note that this file isn't being transpiled so we need to keep it in ES5. Also
// identifiers of the format "$NAME_TMPL" will be replaced by the Bazel rule that
// converts this template file into the actual SystemJS configuration file.

var CORE_PACKAGES = $CORE_ENTRYPOINTS_TMPL;
var IONIC_PACKAGES = $IONIC_ENTRYPOINTS_TMPL;
var MATERIAL_PACKAGES = $MATERIAL_ENTRYPOINTS_TMPL;

/** Map of Angular framework packages and their bundle names. */
var frameworkPackages = $ANGULAR_PACKAGE_BUNDLES;

/** Map of third party packages and their bundle names. */
var thirdPartyPackages = $THIRD_PARTY_PACKAGE_BUNDLES;
var thirdPartyNoNgccPackages = $THIRD_PARTY_NO_NGCC_PACKAGE_BUNDLES;
var thirdPartyGenPackages = $THIRD_PARTY_GEN_PACKAGE_BUNDLES;

/** Whether Ivy is enabled. */
var isRunningWithIvy = '$ANGULAR_IVY_ENABLED_TMPL'.toString() === 'True';

/** Path that relatively resolves to the directory that contains all packages. */
var packagesPath = '$PACKAGES_DIR';

/** Path that relatively resolves to the node_modules directory. */
var nodeModulesPath = '$NODE_MODULES_BASE_PATH';

/** Path mappings that will be registered in SystemJS. */
var pathMapping = {
  'tslib': 'node:tslib/tslib.js',
  'moment': 'node:moment/min/moment-with-locales.min.js',

  'rxjs': 'node:rxjs/bundles/rxjs.umd.min.js',
  'rxjs/operators': 'tools/system-rxjs-operators.js',
};

/** Package configurations that will be used in SystemJS. */
var packagesConfig = {
  // Set the default extension for the root package. Needed for imports to source files
  // without explicit extension. This is common in CommonJS.
  '.': {defaultExtension: 'js'},
  '@angular/cdk': {main: 'bundles/cdk.umd.js'},
  '@angular/cdk/coercion': {main: '../bundles/cdk-coercion.umd.js'},
};

// Manual directories that need to be configured too. These directories are not
// public entry-points, but they are imported in source files as if they were. In order
// to ensure that the directory imports properly resolve to the "index.js" files within
// SystemJS, we configure them similar to actual package entry-points.
CORE_PACKAGES.push('testing/private', 'testing/testbed/fake-events');
IONIC_PACKAGES.push('testing');
MATERIAL_PACKAGES.push('testing');

// Configure framework packages.
setupFrameworkPackages();

// Configure third party packages.
setupThirdPartyPackages();
setupThirdPartyNoNgccPackages();
setupThirdPartyGenPackages();

// Configure Angular components packages/entry-points.
setupLocalReleasePackages();

// Configure the base path and map the different node packages.
System.config({
  baseURL: '$BASE_URL',
  map: pathMapping,
  packages: packagesConfig,
  paths: {
    'node:*': nodeModulesPath + '*',
    paths: {'node:*': nodeModulesPath + '*', 'tpl:*': nodeModulesPath + '*'}
  }
});

/**
 * Walks through all interpolated Angular Framework packages and configures
 * them in SystemJS. Framework packages should always resolve to the UMD bundles.
 */
function setupFrameworkPackages() {
  Object.keys(frameworkPackages).forEach(function(moduleName) {
    var primaryEntryPointSegments = moduleName.split('-');
    // Ensures that imports to the framework package are resolved
    // to the configured node modules directory.
    pathMapping[moduleName] = 'node:' + moduleName;
    // Configure each bundle for the current package.
    frameworkPackages[moduleName].forEach(function(bundleName) {
      // Entry-point segments determined from the UMD bundle name. We split the
      // bundle into segments based on dashes. We omit the leading segments that
      // belong to the primary entry-point module name since we are only interested
      // in the segments that build up the secondary or tertiary entry-point name.
      var segments = bundleName.substring(0, bundleName.length - '.umd.js'.length)
                         .split('-')
                         .slice(primaryEntryPointSegments.length);
      if (segments.length > 1 && segments.slice(-1)[0] !== 'testing') {
        segments = [segments.join('-')];
      }
      // The entry-point name. For secondary entry-points we determine the name from
      // the UMD bundle names. e.g. "animations-browser" results in "@angular/animations/browser".
      var entryPointName = segments.length ? moduleName + '/' + segments.join('/') : moduleName;
      var bundlePath = 'bundles/' + bundleName;
      // When running with Ivy, we need to load the ngcc processed UMD bundles.
      // These are stored in the "__ivy_ngcc_" folder that has been generated
      // since we run ngcc with "--create-ivy-entry-points".
      if (isRunningWithIvy) {
        bundlePath = '__ivy_ngcc__/' + bundlePath;
      }
      packagesConfig[entryPointName] = {
        main: segments
                  .map(function() {
                    return '../'
                  })
                  .join('') +
            bundlePath
      };
    });
  });
}

/**
 * Walks through all interpolated third party packages and configures
 * them in SystemJS. Framework packages should always resolve to the UMD bundles.
 */
function setupThirdPartyPackages() {
  Object.keys(thirdPartyPackages).forEach(function(moduleName) {
    // Ensures that imports to the framework package are resolved
    // to the configured node modules directory.
    pathMapping[moduleName] = 'node:' + moduleName;
    var bundleName = thirdPartyPackages[moduleName];
    var bundlePath = 'bundles/' + bundleName;
    if (isRunningWithIvy) {
      bundlePath = '__ivy_ngcc__/' + bundlePath;
    }
    packagesConfig[moduleName] = {main: bundlePath};
  });
}

function setupThirdPartyNoNgccPackages() {
  Object.keys(thirdPartyNoNgccPackages).forEach(function(moduleName) {
    // Ensures that imports to the framework package are resolved
    // to the configured node modules directory.
    pathMapping[moduleName] = 'node:' + moduleName;
    var bundleName = thirdPartyNoNgccPackages[moduleName];
    packagesConfig[moduleName] = {main: bundleName};
  });
}

function setupThirdPartyGenPackages() {
  Object.keys(thirdPartyGenPackages).forEach(function(moduleName) {
    var bundleName = thirdPartyGenPackages[moduleName];
    pathMapping[moduleName] = 'tpl:tools/third-party-libs/' + bundleName;
  });
}

/** Configures the local release packages in SystemJS */
function setupLocalReleasePackages() {
  // Configure all primary entry-points.
  configureEntryPoint('core');
  configureEntryPoint('ionic-examples');
  configureEntryPoint('ionic');
  configureEntryPoint('material-examples');
  configureEntryPoint('material');

  // Configure all secondary entry-points.
  CORE_PACKAGES.forEach(function(pkgName) {
    configureEntryPoint('core', pkgName);
  });
  IONIC_PACKAGES.forEach(function(pkgName) {
    configureEntryPoint('ionic', pkgName);
  });
  MATERIAL_PACKAGES.forEach(function(pkgName) {
    configureEntryPoint('material', pkgName);
  });

  // Private secondary entry-points.
  configureEntryPoint('ionic-examples', 'private');
  configureEntryPoint('material-examples', 'private');
}

/** Configures the specified package, its entry-point and its examples. */
function configureEntryPoint(pkgName, entryPoint) {
  var name = entryPoint ? pkgName + '/' + entryPoint : pkgName;
  var ionicExamplesName = 'ionic-examples/' + name;
  var materialExamplesName = 'material-examples/' + name;

  pathMapping['@gngt/' + name] = packagesPath + '/' + name;
  pathMapping['@gngt/' + ionicExamplesName] = packagesPath + '/' + ionicExamplesName;
  pathMapping['@gngt/' + materialExamplesName] = packagesPath + '/' + materialExamplesName;

  // Ensure that imports which resolve to the entry-point directory are
  // redirected to the "index.js" file of the directory.
  packagesConfig[packagesPath + '/' + name] =
      packagesConfig[packagesPath + '/' + ionicExamplesName] =
        packagesConfig[packagesPath + '/' + materialExamplesName] = {main: 'index.js'};
}
