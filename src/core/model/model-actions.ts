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

import {Action} from '@ngrx/store';

import {Model, ModelListParams, ModelListResult} from '@gngt/core/common';
import {type} from '@gngt/core/reducers';


export abstract class ModelActionTypes {
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
    DELETE_ALL_SUCCESS: type(`[${typeName}] Delete all success`)
  };
}

export abstract class ModelGetAction implements Action {
  abstract type: string;
  constructor(public payload: {id: number}) { }
}
export abstract class ModelGetSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelGetFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelListAction implements Action {
  abstract type: string;
  constructor(public payload: {params: ModelListParams}) { }
}
export abstract class ModelListSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {result: ModelListResult<T>}) { }
}
export abstract class ModelListFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelCreateAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelCreateSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelCreateFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelUpdateAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelUpdateSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelUpdateFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelPatchAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelPatchSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelPatchFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelDeleteAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelDeleteSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {item: T}) { }
}
export abstract class ModelDeleteFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}

export abstract class ModelDeleteAllAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {items: T[]}) { }
}
export abstract class ModelDeleteAllSuccessAction<T extends Model> implements Action {
  abstract type: string;
  constructor(public payload: {items: T[]}) { }
}
export abstract class ModelDeleteAllFailureAction implements Action {
  abstract type: string;
  constructor(public payload: {error: any}) { }
}
