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

import {ModelManager} from '@gngt/core/common';
import {registerSyncModel} from './sync-utils';

const ANNOTATIONS = '__gngt_annotations__';

export interface SyncModel {
  tableName: string;
}

export function SyncModel<T extends ModelManager>(opts: SyncModel) {
  return function SyncModelFactory(cls: {new(...args: any[]): any}): any {
    const annotations: {[key: string]: any} = cls.hasOwnProperty(ANNOTATIONS)
      ? (cls as any)[ANNOTATIONS]
      : Object.defineProperty(cls, ANNOTATIONS, {value: []})[ANNOTATIONS];
    annotations.push({sync_model: true});

    return class extends cls {
      constructor(...args: any[]) {
        super(...args);
        registerSyncModel((this as any).endPoint, opts.tableName);
      }
    } as any;
  };
}
