import {readFileSync, writeFileSync} from 'fs';
import {platform} from 'os';
import {buildConfig} from './build-config';
import {spawnSync} from 'child_process';

/** Variable that is set to the string for version placeholders. */
const versionPlaceholderText = '0.0.0-PLACEHOLDER';

/** Placeholder that will be replaced with the required Angular version. */
const ngVersionPlaceholderText = '0.0.0-NG';

/** Placeholder that will be replaced with the required Angular Material version. */
const ngmVersionPlaceholderText = '0.0.0-NGM';

/** Placeholder that will be replaced with the required Ngrx Platform version. */
const ngrxVersionPlaceholderText = '0.0.0-NGRX';

/** Placeholder that will be replaced with the required Ngx Tanslate version. */
const ngxtVersionPlaceholderText = '0.0.0-NGXT';

/** Placeholder that will be replaced with the required Ionic version. */
const ionicVersionPlaceholderText = '0.0.0-ION';

/** Placeholder that will be replaced with the required Gic version. */
const gicVersionPlaceholderText = '0.0.0-GIC';

/** RegExp that matches Angular version placeholders inside of a file. */
const ngVersionPlaceholderRegex = new RegExp(ngVersionPlaceholderText, 'g');

/** RegExp that matches Angular Material version placeholders inside of a file. */
const ngmVersionPlaceholderRegex = new RegExp(ngmVersionPlaceholderText, 'g');

/** RegExp that matches Ngrx Platform version placeholders inside of a file. */
const ngrxVersionPlaceholderRegex = new RegExp(ngrxVersionPlaceholderText, 'g');

/** RegExp that matches Ngrx Platform version placeholders inside of a file. */
const ngxtVersionPlaceholderRegex = new RegExp(ngxtVersionPlaceholderText, 'g');

/** RegExp that matches Ngrx Platform version placeholders inside of a file. */
const ionicVersionPlaceholderRegex = new RegExp(ionicVersionPlaceholderText, 'g');

/** RegExp that matches Ngrx Platform version placeholders inside of a file. */
const gicVersionPlaceholderRegex = new RegExp(gicVersionPlaceholderText, 'g');

/** Expression that matches version placeholders within a file. */
const versionPlaceholderRegex = new RegExp(versionPlaceholderText, 'g');

/**
 * Walks through every file in a directory and replaces the version placeholders with the current
 * version of Material.
 */
export function replaceVersionPlaceholders(packageDir: string) {
  // Resolve files that contain version placeholders using Grep or Findstr since those are
  // extremely fast and also have a very simple usage.
  const files = findFilesWithPlaceholders(packageDir);

  // Walk through every file that contains version placeholders and replace those with the current
  // version of the root package.json file.
  files.forEach(filePath => {
    const fileContent = readFileSync(filePath, 'utf-8')
      .replace(ngxtVersionPlaceholderRegex, buildConfig.ngxtVersion)
      .replace(ngrxVersionPlaceholderRegex, buildConfig.ngrxVersion)
      .replace(ngmVersionPlaceholderRegex, buildConfig.angularMaterialVersion)
      .replace(ionicVersionPlaceholderRegex, buildConfig.ionicVersion)
      .replace(gicVersionPlaceholderRegex, buildConfig.gicVersion)
      .replace(ngVersionPlaceholderRegex, buildConfig.angularVersion)
      .replace(versionPlaceholderRegex, buildConfig.projectVersion);

    writeFileSync(filePath, fileContent);
  });
}

/** Finds all files in the specified package dir where version placeholders are included. */
function findFilesWithPlaceholders(packageDir: string): string[] {
  const findCommand = buildPlaceholderFindCommand(packageDir);
  return spawnSync(findCommand.binary, findCommand.args).stdout
    .toString()
    .split(/[\n\r]/)
    .filter(String);
}

/** Builds the command that will be executed to find all files containing version placeholders. */
function buildPlaceholderFindCommand(packageDir: string) {
  if (platform() === 'win32') {
    return {
      binary: 'findstr',
      args: ['/msi', `${ngVersionPlaceholderText} ${versionPlaceholderText}`, `${packageDir}\\*`]
    };
  } else {
    return {
      binary: 'grep',
      args: ['-ril', `${ngVersionPlaceholderText}\\|${versionPlaceholderText}`, packageDir]
    };
  }
}
