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

import * as ts from 'typescript';

import {getSourceFile as baseGetSourceFile} from '@angular/cdk/schematics';
import {Tree} from '@angular-devkit/schematics';
import {Change, InsertChange, NoopChange} from '@schematics/angular/utility/change';
import {findNodes, insertAfterLastOccurrence} from '@schematics/angular/utility/ast-utils';

export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const sourceFile = baseGetSourceFile(host, path);
  if ((sourceFile as ts.Node).kind === ts.SyntaxKind.UnparsedSource) {
    return ts.createSourceFile(sourceFile.fileName, sourceFile.text, ts.ScriptTarget.Latest, true);
  }
  return sourceFile as ts.SourceFile;
}

export function insertExport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
  fileName: string, isDefault = false): Change {
  // @TODO (trik) Cast as any due to incompatible typescript versions
  const rootNode = source as any;
  const allExports = findNodes(rootNode, ts.SyntaxKind.ExportDeclaration);

  // get nodes that map to import statements from the file fileName
  const relevantExports = allExports.filter(node => {
    // StringLiteral of the ImportDeclaration is the export file (fileName in this case).
    const exportFiles = node.getChildren()
      .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
      // @TODO (trik) Cast as any due to incompatible typescript versions
      // .map(n => (n as ts.StringLiteral).text);
      .map(n => (n as any).text);

    return exportFiles.filter(file => file === fileName).length === 1;
  });

  if (relevantExports.length > 0) {
    let exportsAsterisk = false;
    // exports from export file
    const exportNodes: ts.Node[] = [];
    relevantExports.forEach(n => {
      Array.prototype.push.apply(exportNodes, findNodes(n, ts.SyntaxKind.Identifier));
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        exportsAsterisk = true;
      }
    });

    // if exports * from fileName, don't add symbolName
    if (exportsAsterisk) {
      return new NoopChange();
    }

    const exportTextNodes = exportNodes.filter((n: ts.Identifier) => n.text === symbolName);

    // insert export if it's not there
    if (exportTextNodes.length === 0) {
      const iFallbackPos =
        findNodes(relevantExports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
        findNodes(relevantExports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      // @TODO (trik) Cast as any due to incompatible typescript versions
      return insertAfterLastOccurrence(exportNodes as any, `, ${symbolName}`,
          fileToEdit, iFallbackPos);
    }

    return new NoopChange();
  }

  // no such export declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
    // @TODO (trik) Cast as any due to incompatible typescript versions
    // .filter((n: ts.StringLiteral) => n.text === 'use strict');
    .filter((n: any) => n.text === 'use strict');
  let fallbackPos = 0;
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end;
  }
  const open = isDefault ? '' : '{ ';
  const close = isDefault ? '' : ' }';
  // if there are no exports or 'use strict' statement, insert export at beginning of file
  const insertAtBeginning = allExports.length === 0 && useStrict.length === 0;
  const separator = insertAtBeginning ? '' : ';\n';
  const toInsert = `${separator}export ${open}${symbolName}${close}` +
    ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

  if (allExports.length === 0) {
    return new InsertChange(fileToEdit, fallbackPos, toInsert);
  }

  return insertAfterLastOccurrence(
    allExports,
    toInsert,
    fileToEdit,
    fallbackPos,
    ts.SyntaxKind.StringLiteral,
  );
}

export function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
  fileName: string, isDefault = false): Change {
  // @TODO (trik) Cast as any due to incompatible typescript versions
  const rootNode = source as any;
  const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);

  // get nodes that map to import statements from the file fileName
  const relevantImports = allImports.filter(node => {
    // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
    const importFiles = node.getChildren()
      .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
      // @TODO (trik) Cast as any due to incompatible typescript versions
      // .map(n => (n as ts.StringLiteral).text);
      .map(n => (n as any).text);

    return importFiles.filter(file => file === fileName).length === 1;
  });

  if (relevantImports.length > 0) {
    let importsAsterisk = false;
    // imports from import file
    const importNodes: ts.Node[] = [];
    relevantImports.forEach(n => {
      Array.prototype.push.apply(importNodes, findNodes(n, ts.SyntaxKind.Identifier));
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        importsAsterisk = true;
      }
    });

    // if imports * from fileName, don't add symbolName
    if (importsAsterisk) {
      return new NoopChange();
    }

    const importTextNodes = importNodes.filter((n: ts.Identifier) => n.text === symbolName);

    // insert import if it's not there
    if (importTextNodes.length === 0) {
      const iFallbackPos =
        findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
        findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      // @TODO (trik) Cast as any due to incompatible typescript versions
      return insertAfterLastOccurrence(importNodes as any, `, ${symbolName}`,
          fileToEdit, iFallbackPos);
    }

    return new NoopChange();
  }

  // no such import declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
    // @TODO (trik) Cast as any due to incompatible typescript versions
    // .filter((n: ts.StringLiteral) => n.text === 'use strict');
    .filter((n: any) => n.text === 'use strict');
  let fallbackPos = 0;
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end;
  }
  const open = isDefault ? '' : '{ ';
  const close = isDefault ? '' : ' }';
  // if there are no imports or 'use strict' statement, insert import at beginning of file
  const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
  const separator = insertAtBeginning ? '' : ';\n';
  const toInsert = `${separator}import ${open}${symbolName}${close}` +
    ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

  if (allImports.length === 0) {
    return new InsertChange(fileToEdit, fallbackPos, toInsert);
  }

  return insertAfterLastOccurrence(
    allImports,
    toInsert,
    fileToEdit,
    fallbackPos,
    ts.SyntaxKind.StringLiteral,
  );
}

export function getInterfaceDeclaration(node: ts.Node, name: string):
  ts.InterfaceDeclaration | null {
  if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
    const interfaceDecl = node as ts.InterfaceDeclaration;
    if (interfaceDecl.name.getText() === name) {
      return interfaceDecl;
    }
  }

  let foundNode: ts.Node | null = null;
  ts.forEachChild(node, childNode => {
    foundNode = foundNode || getInterfaceDeclaration(childNode, name);
  });

  return foundNode;
}

export function getObjectDeclaration(node: ts.Node, name: string):
  ts.ObjectLiteralExpression | null {
  if (node.kind === ts.SyntaxKind.VariableDeclaration &&
    (node as ts.VariableDeclaration).name.getText() === name &&
    (node as ts.VariableDeclaration).initializer &&
    (node as ts.VariableDeclaration).initializer!.kind === ts.SyntaxKind.ObjectLiteralExpression
  ) {
    return (node as ts.VariableDeclaration).initializer! as ts.ObjectLiteralExpression;
  }

  let foundNode: ts.ObjectLiteralExpression | null = null;
  ts.forEachChild(node, childNode => {
    foundNode = foundNode || getObjectDeclaration(childNode, name);
  });

  return foundNode;
}

export function getArrayDeclaration(node: ts.Node, name: string):
  ts.ArrayLiteralExpression | null {
  if (node.kind === ts.SyntaxKind.VariableDeclaration &&
    (node as ts.VariableDeclaration).name.getText() === name &&
    (node as ts.VariableDeclaration).initializer &&
    (node as ts.VariableDeclaration).initializer!.kind === ts.SyntaxKind.ArrayLiteralExpression
  ) {
    return (node as ts.VariableDeclaration).initializer! as ts.ArrayLiteralExpression;
  }

  let foundNode: ts.ArrayLiteralExpression | null = null;
  ts.forEachChild(node, childNode => {
    foundNode = foundNode || getArrayDeclaration(childNode, name);
  });

  return foundNode;
}

export function addPropertyToInterface(source: ts.SourceFile, fileToEdit: string,
  interfaceName: string, property: string, propertyType: string): Change {
  const interfaceDef = getInterfaceDeclaration(source, interfaceName)!;
  let found = false;
  interfaceDef.members.forEach(m => {
    found = found || m.name!.getText() === property;
  });
  if (found) {
    return new NoopChange();
  }
  const lastMember = interfaceDef.members[interfaceDef.members.length - 1];
  const toInsert = `\n  ${property}: ${propertyType};`;
  return new InsertChange(fileToEdit, lastMember.end, toInsert);
}

export function addPropertyToObject(source: ts.SourceFile, fileToEdit: string,
  objectName: string, property: string, propertyType: string): Change {
  const obj = getObjectDeclaration(source, objectName)!;
  let found = false;
  obj.properties.forEach(p => {
    found = found || p.name!.getText() === property;
  });
  if (found) {
    return new NoopChange();
  }
  const lastProperty = obj.properties[obj.properties.length - 1];
  const toInsert = `,\n  ${property}: ${propertyType}`;
  return new InsertChange(fileToEdit, lastProperty.end, toInsert);
}

export function addElementToArray(source: ts.SourceFile, fileToEdit: string,
  arrayName: string, element: string): Change {
  const obj = getArrayDeclaration(source, arrayName)!;
  let found = false;
  obj.elements.forEach(p => {
    found = found || p.getText() === element;
  });
  if (found) {
    return new NoopChange();
  }
  const lastElement = obj.elements[obj.elements.length - 1];
  const toInsert = `,\n  ${element}`;
  return new InsertChange(fileToEdit, lastElement.end, toInsert);
}
