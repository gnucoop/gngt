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

import * as ModelActions from './model-actions';
import * as reducers from './reducers';

export * from './model-effects';
export * from './model-manager';
export * from './model-options';
export * from './model-options-token';
export * from './model-reducer';
export * from './model-service';
export {ModelActions, reducers};
export {
  Model, ModelGetParams, ModelJoin, ModelListParams, ModelListResult, ModelQueryParams
} from '@gngt/core/common';
