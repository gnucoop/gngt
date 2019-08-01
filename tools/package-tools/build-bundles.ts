import {join, dirname} from 'path';
import {uglifyJsFile} from './minify-sources';
import {buildConfig} from './build-config';
import {BuildPackage} from './build-package';
import {rollupRemoveLicensesPlugin} from './rollup-remove-licenses';
import {rollupGlobals, dashCaseToCamelCase} from './rollup-globals';
import {remapSourcemap} from './sourcemap-remap';

// There are no type definitions available for these imports.
const rollup = require('rollup');
const rollupNodeResolutionPlugin = require('rollup-plugin-node-resolve');
const rollupAlias = require('rollup-plugin-alias');

/** Directory where all bundles will be created in. */
const bundlesDir = join(buildConfig.outputDir, 'bundles');


/** Utility for creating bundles from raw ngc output. */
export class PackageBundler {

  /** Name of the AMD module for the primary entry point of the build package. */
  private readonly _primaryAmdModuleName: string;

  constructor(private _buildPackage: BuildPackage) {
    this._primaryAmdModuleName = this._getAmdModuleName(_buildPackage.name);
  }

  /** Creates all bundles for the package and all associated entry points (UMD, ES5, ES2015). */
  async createBundles() {
    for (const entryPoint of this._buildPackage.secondaryEntryPoints) {
      await this._bundleSecondaryEntryPoint(entryPoint);
    }

    await this._bundlePrimaryEntryPoint();
  }

  /** Bundles the primary entry-point w/ given entry file, e.g. @gngt/core */
  private async _bundlePrimaryEntryPoint() {
    const packageName = this._buildPackage.name;

    return this._bundleEntryPoint({
      entryFile: this._buildPackage.entryFilePath,
      esm5EntryFile: join(this._buildPackage.esm5OutputDir, 'index.js'),
      importName: `@gngt/${packageName}`,
      moduleName: this._primaryAmdModuleName,
      esm2015Dest: join(bundlesDir, `${packageName}.js`),
      esm5Dest: join(bundlesDir, `${packageName}.es5.js`),
      umdDest: join(bundlesDir, `${packageName}.umd.js`),
      umdMinDest: join(bundlesDir, `${packageName}.umd.min.js`),
    });
  }

  /** Bundles a single secondary entry-point w/ given entry file, e.g. @gngt/core/auth */
  private async _bundleSecondaryEntryPoint(entryPointName: string) {
    const packageName = this._buildPackage.name;
    const entryFile = join(this._buildPackage.outputDir, entryPointName, 'index.js');
    const esm5EntryFile = join(this._buildPackage.esm5OutputDir, entryPointName, 'index.js');

    return this._bundleEntryPoint({
      entryFile,
      esm5EntryFile,
      importName: `@gngt/${packageName}/${entryPointName}`,
      moduleName: this._getAmdModuleName(packageName, entryPointName),
      esm2015Dest: join(bundlesDir, `${packageName}`, `${entryPointName}.js`),
      esm5Dest: join(bundlesDir, `${packageName}`, `${entryPointName}.es5.js`),
      umdDest: join(bundlesDir, `${packageName}-${entryPointName}.umd.js`),
      umdMinDest: join(bundlesDir, `${packageName}-${entryPointName}.umd.min.js`),
    });
  }

  /**
   * Creates the ES5, ES2015, and UMD bundles for the specified entry-point.
   * @param config Configuration that specifies the entry-point, module name, and output
   *     bundle paths.
   */
  private async _bundleEntryPoint(config: BundlesConfig) {
    // Build FESM-2015 bundle file.
    await this._createRollupBundle({
      importName: config.importName,
      moduleName: config.moduleName,
      entry: config.entryFile,
      dest: config.esm2015Dest,
      format: 'es',
    });

    // Build FESM-5 bundle file.
    await this._createRollupBundle({
      importName: config.importName,
      moduleName: config.moduleName,
      entry: config.esm5EntryFile,
      dest: config.esm5Dest,
      format: 'es',
    });

    // Create UMD bundle of ES5 output.
    await this._createRollupBundle({
      importName: config.importName,
      moduleName: config.moduleName,
      entry: config.esm5Dest,
      dest: config.umdDest,
      format: 'umd'
    });

    // Create a minified UMD bundle using UglifyJS
    uglifyJsFile(config.umdDest, config.umdMinDest);

    // Remaps the sourcemaps to be based on top of the original TypeScript source files.
    await remapSourcemap(config.esm2015Dest);
    await remapSourcemap(config.esm5Dest);
    await remapSourcemap(config.umdDest);
    await remapSourcemap(config.umdMinDest);
  }

  /** Creates a rollup bundle of a specified JavaScript file. */
  private async _createRollupBundle(config: RollupBundleConfig) {
    const bundleOptions = {
      context: 'this',
      external: Object.keys(rollupGlobals),
      input: config.entry,
      onwarn: (warning: any) => {
        // TODO(jelbourn): figure out *why* rollup warns about certain symbols not being found
        // when those symbols don't appear to be in the input file in the first place.
        if (/but never used/.test(warning.message)) {
          return false;
        }

        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          throw Error(warning.message);
        }

        console.warn(warning.message);
      },
      plugins: [
        rollupRemoveLicensesPlugin,
      ]
    };

    const writeOptions = {
      name: config.moduleName || 'gngt.material',
      amd: {id: config.importName},
      banner: buildConfig.licenseBanner,
      format: config.format,
      file: config.dest,
      globals: rollupGlobals,
      sourcemap: true
    };

    // For UMD bundles, we need to adjust the `external` bundle option in order to include
    // all necessary code in the bundle.
    if (config.format === 'umd') {
      bundleOptions.plugins.push(rollupNodeResolutionPlugin());

      // For all UMD bundles, we want to exclude tslib from the `external` bundle option so that
      // it is inlined into the bundle.
      let external = Object.keys(rollupGlobals);
      external.splice(external.indexOf('tslib'), 1);

      // If each secondary entry-point is re-exported at the root, we want to exclude those
      // secondary entry-points from the rollup globals because we want the UMD for the
      // primary entry-point to include *all* of the sources for those entry-points.
      if (this._buildPackage.exportsSecondaryEntryPointsAtRoot &&
          config.moduleName === this._primaryAmdModuleName) {

        const importRegex = new RegExp(`@gngt/${this._buildPackage.name}/.+`);
        external = external.filter(e => !importRegex.test(e));

        // Use the rollup-alias plugin to map imports of the form `@gngt/core/auth`
        // to the actual file location so that rollup can resolve the imports (otherwise they
        // will be treated as external dependencies and not included in the bundle).
        bundleOptions.plugins.push(
            rollupAlias(this._getResolvedSecondaryEntryPointImportPaths(config.dest)));
      }

      bundleOptions.external = external;
    }

    return rollup.rollup(bundleOptions).then((bundle: any) => bundle.write(writeOptions));
  }

  /**
   * Gets mapping of import aliases (e.g. `@gngt/core/auth`) to the path of the es5
   * bundle output.
   * @param bundleOutputDir Path to the bundle output directory.
   * @returns Map of alias to resolved path.
   */
  private _getResolvedSecondaryEntryPointImportPaths(bundleOutputDir: string) {
    return this._buildPackage.secondaryEntryPoints.reduce((map, p) => {
      map[`@gngt/${this._buildPackage.name}/${p}`] =
          join(dirname(bundleOutputDir), this._buildPackage.name, `${p}.es5.js`);
      return map;
    }, {} as {[key: string]: string});
  }

  /**
   * Gets the AMD module name for a package and an optional entry point. This is consistent
   * to the module name format being used in "gngt/material".
   */
  private _getAmdModuleName(packageName: string, entryPointName?: string) {
    // For example, the AMD module name for the "@gngt/material-examples" package should be
    // "gngt.materialExamples". We camel-case the package name in case it contains dashes.
    let amdModuleName = `gngt.${dashCaseToCamelCase(packageName)}`;

    if (entryPointName) {
      // For example, the "@gngt/material/checkbox-group" entry-point should be converted into
      // the following AMD module name: "gngt.material.checkboxGroup". Similar to the package name,
      // the entry-point name needs to be camel-cased in case it contains dashes.
      amdModuleName += `.${dashCaseToCamelCase(entryPointName)}`;
    }

    return amdModuleName;
  }
}

/** Configuration for creating library bundles. */
interface BundlesConfig {
  entryFile: string;
  esm5EntryFile: string;
  importName: string;
  moduleName: string;
  esm2015Dest: string;
  esm5Dest: string;
  umdDest: string;
  umdMinDest: string;
}

/** Configuration for creating a bundle via rollup. */
interface RollupBundleConfig {
  entry: string;
  dest: string;
  format: string;
  moduleName: string;
  importName: string;
}
