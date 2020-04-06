/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
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

import {getObjectProperty} from '@gngt/core/common';

export function localSort<T>(
  docs: PouchDB.Core.ExistingDocument<T>[],
  sort: Array<string|{[key: string]: 'asc' | 'desc'}>
): PouchDB.Core.ExistingDocument<T>[] {
  const sortDirs = {} as {[key: string]: 'asc' | 'desc'};
  const sortKeys = sort.map(s => {
    if (typeof s === 'string') {
      sortDirs[s] = 'asc';
      return s;
    }
    const keys = Object.keys(s);
    if (keys.length === 1) {
      sortDirs[keys[0]] = s[keys[0]];
      return keys[0];
    }
    return null;
  }).filter(k => k != null) as string[];
  if (docs.length === 0 || sortKeys.length === 0) { return docs; }
  const doc = docs[0];
  const isAsc = sortDirs[0] === 'asc';
  const sortTypes = {} as {[key: string]: string};
  sortKeys.forEach(key => {
    sortTypes[key] = typeof getObjectProperty(doc, key);
  });
  const sortReduce = (
    obj: PouchDB.Core.ExistingDocument<T>,
  ) => {
    return (key: string, cur: string) => {
      const field = getObjectProperty(obj, cur);
      if (sortTypes[cur] === 'number') {
        let fieldPad = `00000000000000000000${field}`;
        return `${key}${fieldPad.substr(fieldPad.length - 20)}`;
      }
      return `${key}${field}`;
    };
  };

  return docs.sort((a, b) => {
    const first = isAsc ? a : b;
    const second = isAsc ? b : a;
    const firstKey = sortKeys.reduce(sortReduce(first), '');
    const lastKey = sortKeys.reduce(sortReduce(second), '');
    return firstKey.localeCompare(lastKey);
  });
}
