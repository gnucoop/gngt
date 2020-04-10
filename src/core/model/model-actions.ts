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

import {Model, ModelListParams, ModelListResult, ModelQueryParams} from '@gngt/core/common';
import {type} from '@gngt/core/reducers';

import {ModelError} from './model-error';
import {ModelGenericAction} from './model-generic-action';

export interface ModelActionTypes {
  GET: string;
  GET_FAILURE: string;
  GET_SUCCESS: string;
  LIST: string;
  LIST_SUCCESS: string;
  LIST_FAILURE: string;
  CREATE: string;
  CREATE_SUCCESS: string;
  CREATE_FAILURE: string;
  UPDATE: string;
  UPDATE_SUCCESS: string;
  UPDATE_FAILURE: string;
  PATCH: string;
  PATCH_SUCCESS: string;
  PATCH_FAILURE: string;
  DELETE: string;
  DELETE_SUCCESS: string;
  DELETE_FAILURE: string;
  DELETE_ALL: string;
  DELETE_ALL_SUCCESS: string;
  DELETE_ALL_FAILURE: string;
  QUERY: string;
  QUERY_SUCCESS: string;
  QUERY_FAILURE: string;
}

export function generateModelActionTypes(typeName: string): ModelActionTypes {
  return {
    LIST: type(`[${typeName}] List`),
    LIST_FAILURE: type(`[${typeName}] List failure`),
    LIST_SUCCESS: type(`[${typeName}] List success`),
    GET: type(`[${typeName}] Get`),
    GET_FAILURE: type(`[${typeName}] Get failure`),
    GET_SUCCESS: type(`[${typeName}] Get success`),
    CREATE: type(`[${typeName}] Create`),
    CREATE_FAILURE: type(`[${typeName}] Create failure`),
    CREATE_SUCCESS: type(`[${typeName}] Create success`),
    UPDATE: type(`[${typeName}] Update`),
    UPDATE_FAILURE: type(`[${typeName}] Update failure`),
    UPDATE_SUCCESS: type(`[${typeName}] Update success`),
    PATCH: type(`[${typeName}] Patch`),
    PATCH_FAILURE: type(`[${typeName}] Patch failure`),
    PATCH_SUCCESS: type(`[${typeName}] Patch success`),
    DELETE: type(`[${typeName}] Delete`),
    DELETE_FAILURE: type(`[${typeName}] Delete failure`),
    DELETE_SUCCESS: type(`[${typeName}] Delete success`),
    DELETE_ALL: type(`[${typeName}] Delete all`),
    DELETE_ALL_FAILURE: type(`[${typeName}] Delete all failure`),
    DELETE_ALL_SUCCESS: type(`[${typeName}] Delete all success`),
    QUERY: type(`[${typeName}] Query`),
    QUERY_FAILURE: type(`[${typeName}] Query failure`),
    QUERY_SUCCESS: type(`[${typeName}] Query success`),
  };
}

export abstract class ModelBaseAction implements ModelGenericAction {
  abstract type: string;
  uuid: string;
  constructor(public payload: any) {}
}

export abstract class ModelGetAction extends ModelBaseAction {
  constructor(public payload: {id: number}) {
    super(payload);
  }
}
export abstract class ModelGetSuccessAction<T extends Model> extends ModelBaseAction {
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelGetFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelListAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {params: ModelListParams}) {
    super(payload);
  }
}
export abstract class ModelListSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {result: ModelListResult<T>}) {
    super(payload);
  }
}
export abstract class ModelListFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelCreateAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelCreateSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelCreateFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelUpdateAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelUpdateSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelUpdateFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelPatchAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelPatchSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelPatchFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelDeleteAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelDeleteSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {item: T}) {
    super(payload);
  }
}
export abstract class ModelDeleteFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelDeleteAllAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {items: T[]}) {
    super(payload);
  }
}
export abstract class ModelDeleteAllSuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {items: T[]}) {
    super(payload);
  }
}
export abstract class ModelDeleteAllFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}

export abstract class ModelQueryAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {params: ModelQueryParams}) {
    super(payload);
  }
}
export abstract class ModelQuerySuccessAction<T extends Model> extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {result: ModelListResult<T>}) {
    super(payload);
  }
}
export abstract class ModelQueryFailureAction extends ModelBaseAction {
  abstract type: string;
  constructor(public payload: {error: ModelError}) {
    super(payload);
  }
}
