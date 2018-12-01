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

import {Change, InsertChange, NoopChange} from '@schematics/angular/utility/change';
import {findNodes, insertAfterLastOccurrence} from '@schematics/angular/utility/ast-utils';

export function insertExport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
  fileName: string, isDefault = false): Change {
  const rootNode = source;
  const allExports = findNodes(rootNode, ts.SyntaxKind.ExportDeclaration);

  // get nodes that map to import statements from the file fileName
  const relevantExports = allExports.filter(node => {
    // StringLiteral of the ImportDeclaration is the export file (fileName in this case).
    const exportFiles = node.getChildren()
      .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
      .map(n => (n as ts.StringLiteral).text);

    return exportFiles.filter(file => file === fileName).length === 1;
  });

  if (relevantExports.length > 0) {
    let exportsAsterisk = false;
    // exports from export file
    const exportNodes: ts.Node[] = [];
    relevantExports.forEach(n => {
      Array.prototype.push.apply(exports, findNodes(n, ts.SyntaxKind.Identifier));
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        exportsAsterisk = true;
      }
    });

    // if exports * from fileName, don't add symbolName
    if (exportsAsterisk) {
      return new NoopChange();
    }

    const exportTextNodes = exports.filter(n => (n as ts.Identifier).text === symbolName);

    // insert export if it's not there
    if (exportTextNodes.length === 0) {
      const iFallbackPos =
      findNodes(relevantExports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
      findNodes(relevantExports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      return insertAfterLastOccurrence(exportNodes, `, ${symbolName}`, fileToEdit, iFallbackPos);
    }

    return new NoopChange();
  }

  // no such import declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
    .filter((n: ts.StringLiteral) => n.text === 'use strict');
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

  return insertAfterLastOccurrence(
    allExports,
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
