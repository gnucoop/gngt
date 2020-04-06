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

import {Model, ModelListResult} from '@gngt/core/common';
import {Action} from '@ngrx/store';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of as obsOf, Observable} from 'rxjs';
import {catchError, map, mergeMap} from 'rxjs/operators';

import {
  ModelActionTypes,
  ModelCreateAction,
  ModelDeleteAction,
  ModelDeleteAllAction,
  ModelGetAction,
  ModelListAction,
  ModelPatchAction,
  ModelQueryAction,
  ModelUpdateAction,
} from './model-actions';
import {ModelManager} from './model-manager';
import {ModelService} from './model-service';
import * as fromModel from './model-reducer';
import {createAction} from './utils';

export abstract class ModelEffects<
    M extends Model = Model,
    S extends fromModel.State<M> = fromModel.State<M>,
    A extends Action = Action,
    AT extends ModelActionTypes = ModelActionTypes> {

  protected readonly modelGet$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelGetAction>(this._actionTypes.GET),
    mergeMap(action => this._manager.get(action.payload.id).pipe(
      map((item: M) => createAction<A>({
        type: this._actionTypes.GET_SUCCESS,
        payload: {item},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.GET_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelList$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelListAction>(this._actionTypes.LIST),
    mergeMap(action => this._manager.list(action.payload.params).pipe(
      map((result: ModelListResult<M>) => createAction<A>({
        type: this._actionTypes.LIST_SUCCESS,
        payload: {result},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.LIST_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelCreate$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelCreateAction<M>>(this._actionTypes.CREATE),
    mergeMap(action => this._manager.create(action.payload.item).pipe(
      map((item: M) => createAction<A>({
        type: this._actionTypes.CREATE_SUCCESS,
        payload: {item},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.CREATE_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelUpdate$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelUpdateAction<M>>(this._actionTypes.UPDATE),
    mergeMap(action => this._manager.update(action.payload.item.id, action.payload.item).pipe(
      map((item: M) => createAction<A>({
        type: this._actionTypes.UPDATE_SUCCESS,
        payload: {item},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.CREATE_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelPatch$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelPatchAction<M>>(this._actionTypes.PATCH),
    mergeMap(action => this._manager.patch(action.payload.item.id, action.payload.item).pipe(
      map((item: M) => createAction<A>({
        type: this._actionTypes.PATCH_SUCCESS,
        payload: {item},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.PATCH_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelDelete$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelDeleteAction<M>>(this._actionTypes.DELETE),
    mergeMap(action => this._manager.delete(action.payload.item.id).pipe(
      map(() => createAction<A>({
        type: this._actionTypes.DELETE_SUCCESS,
        payload: {item: action.payload.item},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.DELETE_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelDeleteAll$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelDeleteAllAction<M>>(this._actionTypes.DELETE_ALL),
    mergeMap(action => this._manager.deleteAll(action.payload.items.map(i => i.id)).pipe(
      map(() => createAction<A>({
        type: this._actionTypes.DELETE_ALL_SUCCESS,
        payload: {items: action.payload.items},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.DELETE_ALL_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  protected readonly modelQuery$: Observable<A> = createEffect(() => this._actions.pipe(
    ofType<ModelQueryAction>(this._actionTypes.QUERY),
    mergeMap(action => this._manager.query(action.payload.params).pipe(
      map((result: ModelListResult<M>) => createAction<A>({
        type: this._actionTypes.QUERY_SUCCESS,
        payload: {result},
        uuid: action.uuid
      })),
      catchError(error => obsOf(createAction<A>({
        type: this._actionTypes.QUERY_FAILURE,
        payload: {message: error.message, stack: error.stack},
        uuid: action.uuid
      }))),
    ))
  ));

  constructor(
    protected _actions: Actions,
    protected _service: ModelService<M, S, AT>,
    protected _manager: ModelManager<M>,
    private _actionTypes: AT,
  ) { }
}
