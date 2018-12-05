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

import {join} from 'path';
import {strings} from '@angular-devkit/core';
import {
  apply, chain, filter, mergeWith, move, noop, Rule, template, Tree, url
} from '@angular-devkit/schematics';
import {FileSystemSchematicContext} from '@angular-devkit/schematics/tools';
import {getProjectFromWorkspace, getSourceFile} from '@angular/cdk/schematics';
import {addProviderToModule, insertImport} from '@schematics/angular/utility/ast-utils';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {getWorkspace} from '@schematics/angular/utility/config';
import {parseName} from '@schematics/angular/utility/parse-name';
import {buildDefaultPath} from '@schematics/angular/utility/project';
import {validateName} from '@schematics/angular/utility/validation';
import {
  addElementToArray, addPropertyToInterface, addPropertyToObject, insertExport
} from './ast-utils';
import {ModelOptions} from './model-options';

/**
 * Indents the text content with the amount of specified spaces. The spaces will be added after
 * every line-break. This utility function can be used inside of EJS templates to properly
 * include the additional files.
 */
function indentTextContent(text: string, numSpaces: number): string {
  // In the Gngt project there should be only LF line-endings, but the schematic files
  // are not being linted and therefore there can be also CRLF or just CR line-endings.
  return text.replace(/(\r\n|\r|\n)/g, `$1${' '.repeat(numSpaces)}`);
}

function addIndexExports(options: ModelOptions, packagePath: string): Rule {
  return (host: Tree) => {
    const dasherizedModel = strings.dasherize(options.model);
    const path = join(packagePath, 'index.ts');
    const content = getSourceFile(host, path);
    const newExports = [`./${dasherizedModel}`, `./${dasherizedModel}.service`];
    const recorder = host.beginUpdate(path);
    newExports.forEach(exp => {
      const change = insertExport(content, path, '*', exp, true) as InsertChange;
      if (change && change.pos != null && change.toAdd) {
        recorder.insertLeft(change.pos, change.toAdd);
      }
    });
    host.commitUpdate(recorder);
    return host;
  };
}

function addModelReducers(options: ModelOptions, packagePath: string): Rule {
  return (host: Tree) => {
    const path = join(packagePath, 'reducers.ts');
    let content = getSourceFile(host, path);
    const recorder = host.beginUpdate(path);
    const classifiedPackage = strings.classify(options.package);
    const classifiedModel = strings.classify(options.model);
    const camelizedModel = strings.camelize(options.model);
    const dasherizedModel = strings.dasherize(options.model);
    const importStr = `* as from${classifiedModel}`;
    const fromStr = `./${dasherizedModel}.reducers`;
    let change = insertImport(content, path, importStr, fromStr, true) as InsertChange;
    if (change && change.pos != null && change.toAdd) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
    change = addPropertyToInterface(content, path, `${classifiedPackage}State`,
      camelizedModel, `from${classifiedModel}.State`) as InsertChange;
    if (change && change.pos != null && change.toAdd) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
    const reducerType = `from${classifiedModel}.${camelizedModel}Reducer`;
    change = addPropertyToObject(
      content, path, 'reducers', camelizedModel, reducerType) as InsertChange;
    if (change && change.pos != null && change.toAdd) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
    host.commitUpdate(recorder);
    return host;
  };
}

function addModelProviders(options: ModelOptions, packagePath: string): Rule {
  return (host: Tree) => {
    const dasherizedPackage = strings.dasherize(options.package);
    const uppercasePackage = strings.underscore(options.package).toUpperCase();
    const path = join(packagePath, `${dasherizedPackage}.module.ts`);
    let content = getSourceFile(host, path);
    const classifiedModel = strings.classify(options.model);
    const dasherizedModel = strings.dasherize(options.model);

    const services = ['manager', 'service', 'effects'];
    services.forEach(service => {
      const cfService = strings.capitalize(service);
      const serviceName = `${classifiedModel}${cfService}`;
      const servicePath = `./${dasherizedModel}.${service}`;
      let change: Change = insertImport(
        content, path, `{${serviceName}}`, servicePath, true) as InsertChange;
      if (change && change instanceof InsertChange) {
        const recorder = host.beginUpdate(path);
        recorder.insertLeft(change.pos, change.toAdd);
        host.commitUpdate(recorder);
        content = getSourceFile(host, path);
      }
      let changes = addProviderToModule(content, path, serviceName, servicePath);
      if (changes) {
        const recorder = host.beginUpdate(path);
        changes.forEach((c) => {
          if (c instanceof InsertChange) {
            recorder.insertLeft(c.pos, c.toAdd);
          }
        });
        host.commitUpdate(recorder);
        content = getSourceFile(host, path);
      }
      if (service === 'effects') {
        const effectsArray = `${uppercasePackage}_EFFECTS`;
        change = addElementToArray(content, path, effectsArray, serviceName);
        if (change && change instanceof InsertChange) {
          const recorder = host.beginUpdate(path);
          recorder.insertLeft(change.pos, change.toAdd);
          host.commitUpdate(recorder);
        }
      }
    });
  };
}

export function buildModel(options: ModelOptions): Rule {
  return (host: Tree, context: FileSystemSchematicContext) => {
    const workspace = getWorkspace(host);
    const project = getProjectFromWorkspace(workspace, options.project);

    const schematicFilesUrl = './files';

    const packagePath = join(buildDefaultPath(project as any), options.package);
    const parsedPath = parseName(packagePath, options.model);
    options.path = parsedPath.path;

    validateName(options.model);

    const indexPath = join(packagePath, 'index.ts');
    const reducersPath = join(packagePath, 'reducers.ts');
    const modulePath = join(packagePath, `${strings.dasherize(options.package)}.module.ts`);
    const generateModule = !(
      host.exists(indexPath)
      && host.exists(reducersPath)
      && host.exists(modulePath)
    );

    const baseTemplateContext = {
      ...strings,
      ...options,
    };

    const templateSource = apply(url(schematicFilesUrl), [
      generateModule ? noop() : filter(path =>
        !path.endsWith('.module.ts') && !path.endsWith('/reducers.ts') &&
        !path.endsWith('index.ts')),
      // Treat the template options as any, because the type definition for the template options
      // is made unnecessarily explicit. Every type of object can be used in the EJS template.
      template({indentTextContent, ...baseTemplateContext} as any),
      // TODO(devversion): figure out why we cannot just remove the first parameter
      // See for example: angular-cli#schematics/angular/component/index.ts#L160
      move(null as any, parsedPath.path),
    ]);

    return chain([
      mergeWith(templateSource),
      generateModule ? noop() : addIndexExports(options, packagePath),
      generateModule ? noop() : addModelReducers(options, packagePath),
      generateModule ? noop() : addModelProviders(options, packagePath)
    ])(host, context);
  };
}
