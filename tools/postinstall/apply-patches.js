/**
 * Script that runs after node modules have been installed (including Bazel managed
 * node modules). This script can be used to apply postinstall patches. Similarly
 * to Bazel's "patches" attribute on repository fetch rules.
 */

const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');

/**
 * Version of the post install patch. Needs to be incremented when
 * existing patches or edits have been modified.
 */
const PATCH_VERSION = 9;

/** Path to the project directory. */
const projectDir = path.join(__dirname, '../..');

/**
 * Object that maps a given file path to a list of patches that need to be
 * applied.
 */
const PATCHES_PER_FILE = {};

const PATCH_MARKER_FILE_PATH = path.join(projectDir, 'node_modules/_ng-comp-patch-marker.json');

/** Registry of applied patches. */
let registry = null;

main();

async function main() {
  shelljs.set('-e');
  shelljs.cd(projectDir);

  registry = await readAndValidatePatchMarker();

  // Apply all patches synchronously.
  try {
    applyPatches();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  // Write the patch marker file so that we don't accidentally re-apply patches
  // in subsequent Yarn installations.
  fs.writeFileSync(PATCH_MARKER_FILE_PATH, JSON.stringify(registry, null, 2));
}

function applyPatches() {
  // Workaround for https://github.com/angular/angular/issues/18810.
  shelljs.exec('ngc -p angular-tsconfig.json');

  // Workaround for: https://github.com/angular/angular/issues/32651. We just do not
  // generate re-exports for secondary entry-points. Similar to what "ng-packagr" does.
  searchAndReplace(
      /(?!function\s+)createMetadataReexportFile\([^)]+\);/, '',
      'node_modules/@angular/bazel/src/ng_package/packager.js');
  searchAndReplace(
      /(?!function\s+)createTypingsReexportFile\([^)]+\);/, '',
      'node_modules/@angular/bazel/src/ng_package/packager.js');

  // Workaround for: https://github.com/angular/angular/pull/32650
  searchAndReplace(
      'var indexFile;', `
    var indexFile = files.find(f => f.endsWith('/public-api.ts'));
  `,
      'node_modules/@angular/compiler-cli/src/metadata/bundle_index_host.js');
  searchAndReplace(
      'var resolvedEntryPoint = null;', `
    var resolvedEntryPoint = tsFiles.find(f => f.endsWith('/public-api.ts')) || null;
  `,
      'node_modules/@angular/compiler-cli/src/ngtsc/entry_point/src/logic.js');

  // Workaround for: https://hackmd.io/MlqFp-yrSx-0mw4rD7dnQQ?both. We only want to discard
  // the metadata of files in the bazel managed node modules. That way we keep the default
  // behavior of ngc-wrapped except for dependencies between sources of the library. This makes
  // the "generateCodeForLibraries" flag more accurate in the Bazel environment where previous
  // compilations should not be treated as external libraries. Read more about this in the document.
  searchAndReplace(
      /if \((this\.options\.generateCodeForLibraries === false)/, `
    const fs = require('fs');
    const hasFlatModuleBundle = fs.existsSync(filePath.replace('.d.ts', '.metadata.json'));
    if ((filePath.includes('node_modules/') || !hasFlatModuleBundle) && $1`,
      'node_modules/@angular/compiler-cli/src/transformers/compiler_host.js');
  applyPatch(path.join(__dirname, './flat_module_factory_resolution.patch'));
  searchAndReplace(
      /(TsCompilerAotCompilerTypeCheckHostAdapter\.prototype\.fromSummaryFileName = function \(fileName, referringLibFileName\) {)/,
      `$1
              var ext = /|@angular\\/cdk@angular\\/material|@gic\\/angular|@ionic\\/angular/g;
              if (ext.test(referringLibFileName)) {
                  fileName = fileName.replace('.ngfactory', '');
              }`,
      'node_modules/@angular/compiler-cli/src/transformers/compiler_host.js');
  // The three replacements below ensure that metadata files can be read by NGC and
  // that metadata files are collected as Bazel action inputs.
  searchAndReplace(
      /(const NGC_ASSETS = \/[^(]+\()([^)]*)(\).*\/;)/, '$1$2|metadata.json$3',
      'node_modules/@angular/bazel/src/ngc-wrapped/index.js');
  searchAndReplace(
      /^((\s*)results = depset\(dep.angular.summaries, transitive = \[results]\))$/m,
      `$1#\n$2results = depset(dep.angular.metadata, transitive = [results])`,
      'node_modules/@angular/bazel/src/ng_module.bzl');
  searchAndReplace(
      /^((\s*)results = depset\(target.angular\.summaries if _has_target_angular_summaries\(target\) else \[]\))$/m,
      `$1#\n$2results = depset(target.angular.metadata if _has_target_angular_summaries(target) else [], transitive = [results])`,
      'node_modules/@angular/bazel/src/ng_module.bzl');
  // Ensure that "metadata" of transitive dependencies can be collected.
  searchAndReplace(
      /providers\["angular"]\["metadata"] = outs\.metadata/,
      `$& + [m for dep in ctx.attr.deps if (hasattr(dep, "angular") and hasattr(dep.angular, "metadata")) for m in dep.angular.metadata]`,
      'node_modules/@angular/bazel/src/ng_module.bzl');

  // Workaround for: https://github.com/bazelbuild/rules_nodejs/issues/1208.
  applyPatch(path.join(__dirname, './manifest_externs_hermeticity.patch'));

  // Patches the changes from: https://github.com/bazelbuild/rules_typescript/pull/504.
  applyPatch(path.join(__dirname, './@bazel_typescript_tsc_wrapped_worker_cache_fix.patch'));

  // Workaround for https://github.com/angular/angular/issues/33452:
  searchAndReplace(
      /angular_compiler_options = {/, `$&
          "strictTemplates": True,`,
      'node_modules/@angular/bazel/src/ng_module.bzl');

  // More info in https://github.com/angular/angular/pull/33786
  shelljs.rm('-rf', [
    'node_modules/rxjs/add/',
    'node_modules/rxjs/observable/',
    'node_modules/rxjs/operator/',
    // rxjs/operators is a public entry point that also contains files to support legacy deep import
    // paths, so we need to preserve index.* and package.json files that are required for module
    // resolution.
    'node_modules/rxjs/operators/!(index.*|package.json)',
    'node_modules/rxjs/scheduler/',
    'node_modules/rxjs/symbol/',
    'node_modules/rxjs/util/',
    'node_modules/rxjs/internal/Rx.d.ts',
    'node_modules/rxjs/AsyncSubject.*',
    'node_modules/rxjs/BehaviorSubject.*',
    'node_modules/rxjs/InnerSubscriber.*',
    'node_modules/rxjs/interfaces.*',
    'node_modules/rxjs/Notification.*',
    'node_modules/rxjs/Observable.*',
    'node_modules/rxjs/Observer.*',
    'node_modules/rxjs/Operator.*',
    'node_modules/rxjs/OuterSubscriber.*',
    'node_modules/rxjs/ReplaySubject.*',
    'node_modules/rxjs/Rx.*',
    'node_modules/rxjs/Scheduler.*',
    'node_modules/rxjs/Subject.*',
    'node_modules/rxjs/SubjectSubscription.*',
    'node_modules/rxjs/Subscriber.*',
    'node_modules/rxjs/Subscription.*',
  ]);

  // Apply all collected patches on a per-file basis. This is necessary because
  // multiple edits might apply to the same file, and we only want to mark a given
  // file as patched once all edits have been made.
  Object.keys(PATCHES_PER_FILE).forEach(filePath => {
    if (isFilePatched(filePath)) {
      console.info('File ' + filePath + ' is already patched. Skipping..');
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const patchFunctions = PATCHES_PER_FILE[filePath];

    console.info(`Patching file ${filePath} with ${patchFunctions.length} edits..`);
    patchFunctions.forEach(patchFn => content = patchFn(content));

    fs.writeFileSync(filePath, content, 'utf8');
    captureFileAsPatched(filePath);
  });
}

/**
 * Applies the given patch if not done already. Throws if the patch
 * does not apply cleanly.
 */
function applyPatch(patchFile) {
  if (isFilePatched(patchFile)) {
    console.info('Patch: ' + patchFile + ' has been applied already. Skipping..');
    return;
  }

  shelljs.cat(patchFile).exec('patch -p0');
  captureFileAsPatched(patchFile);
}

/**
 * Schedules an edit where the specified file is read and its content replaced based on
 * the given search expression and corresponding replacement. Throws if no changes were made
 * and the patch has not been applied.
 */
function searchAndReplace(search, replacement, relativeFilePath) {
  const filePath = path.join(projectDir, relativeFilePath);
  const fileEdits = PATCHES_PER_FILE[filePath] || (PATCHES_PER_FILE[filePath] = []);

  fileEdits.push(originalContent => {
    const newFileContent = originalContent.replace(search, replacement);
    if (originalContent === newFileContent) {
      throw Error(
          `Could not perform replacement in: ${filePath}.\n` +
          `Searched for pattern: ${search}`);
    }
    return newFileContent;
  });
}

/** Gets a project unique id for a given file path. */
function getIdForFile(filePath) {
  return path.relative(projectDir, filePath).replace(/\\/g, '/');
}

/** Marks the specified file as patched. */
function captureFileAsPatched(filePath) {
  registry.patched[getIdForFile(filePath)] = true;
}

/** Checks whether the given file is patched. */
function isFilePatched(filePath) {
  return registry.patched[getIdForFile(filePath)] === true;
}

/**
 * Reads the patch marker from the node modules if present. Validates that applied
 * patches are up-to-date. If not, an error will be reported with a prompt that
 * allows convenient clean up of node modules in case those need to be cleaned up.
 */
async function readAndValidatePatchMarker() {
  if (!shelljs.test('-e', PATCH_MARKER_FILE_PATH)) {
    return {version: PATCH_VERSION, patched: {}};
  }
  const registry = JSON.parse(shelljs.cat(PATCH_MARKER_FILE_PATH));
  // If the node modules are up-to-date, return the parsed patch registry.
  if (registry.version === PATCH_VERSION) {
    return registry;
  }
  // Print errors that explain the current situation where patches from another
  // postinstall patch revision are applied in the current node modules.
  if (registry.version < PATCH_VERSION) {
    console.error(chalk.red('Your node modules have been patched by a previous Yarn install.'));
    console.error(chalk.red('The postinstall patches have changed since then, and in order to'));
    console.error(chalk.red('apply the most recent patches, your node modules need to be cleaned'));
    console.error(chalk.red('up from past changes.'));
  } else {
    console.error(chalk.red('Your node modules already have patches applied from a more recent.'));
    console.error(chalk.red('revision of the components repository. In order to be able to apply'));
    console.error(chalk.red('patches for the current revision, your node modules need to be'));
    console.error(chalk.red('cleaned up.'));
  }

  let cleanupModules = true;

  // Do not prompt if there is no TTY. Inquirer does not skip in non-tty environments.
  // TODO: Remove once inquirer has been updated to v8.x where TTY is respected.
  if (process.stdin.isTTY) {
    cleanupModules = (await inquirer.prompt({
      name: 'result',
      type: 'confirm',
      message: 'Clean up node modules automatically?',
      default: false
    })).result;
  }

  if (cleanupModules) {
    // This re-runs Yarn with `--check-files` mode. The postinstall will rerun afterwards,
    // so we can exit with a zero exit-code here.
    shelljs.exec('yarn --check-files --frozen-lockfile', {cwd: projectDir});
    process.exit(0);
  } else {
    process.exit(1);
  }
}
