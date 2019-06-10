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

import {SYNC_REGISTERED_MODELS} from './registered-models';

export function registerSyncModel(endpoint: string, tableName: string): void {
  if (SYNC_REGISTERED_MODELS.find(r => r.tableName === tableName) == null) {
    const registeredModel = {tableName, endpoint};
    SYNC_REGISTERED_MODELS.push(registeredModel);
    console.log(`Registered sync model ${tableName} with endpoint ${endpoint}`);
  }
}
