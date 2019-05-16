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

import {of as obsOf, Observable} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';

import {Action} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';

import {Model, ModelListResult} from '@gngt/core/common';
import * as ModelActions from './model-actions';
import {ModelManager} from './model-manager';
import {ModelService} from './model-service';
import * as fromModel from './model-reducer';
import {createAction} from './utils';

export abstract class ModelEffects<
    M extends Model,
    S extends fromModel.State<M>,
    A extends Action,
    AT extends ModelActions.ModelActionTypes> {

  protected readonly modelGet$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelGetAction>(this._actionTypes.GET),
      concatMap(action =>
        this._manager.get(action.payload.id)
          .pipe(
            map((item: M) => createAction<A>(this._actionTypes.GET_SUCCESS, {item})),
            catchError(error =>
              obsOf(createAction<A>(this._actionTypes.GET_FAILURE, {error})))
          )
      )
    );

  protected readonly modelList$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelListAction>(this._actionTypes.LIST),
      concatMap(action =>
        this._manager.list(action.payload.params)
          .pipe(
            map((result: ModelListResult<M>) =>
              createAction<A>(this._actionTypes.LIST_SUCCESS, {result})),
            catchError(error =>
              obsOf(createAction<A>(this._actionTypes.LIST_FAILURE, {error})))
          )
      )
    );

  protected readonly modelCreate$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelCreateAction<M>>(this._actionTypes.CREATE),
      concatMap(action =>
        this._manager.create(action.payload.item)
          .pipe(
            map((item: M) => createAction<A>(this._actionTypes.CREATE_SUCCESS, {item})),
            catchError(error => obsOf(createAction<A>(this._actionTypes.CREATE_FAILURE, {error})))
          )
      )
    );

  protected readonly modelUpdate$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelUpdateAction<M>>(this._actionTypes.UPDATE),
      concatMap(action =>
        this._manager.update(action.payload.item.id, action.payload.item)
          .pipe(
            map((item: M) => createAction<A>(this._actionTypes.UPDATE_SUCCESS, {item})),
            catchError(error => obsOf(createAction<A>(this._actionTypes.CREATE_FAILURE, {error})))
          )
      )
    );

  protected readonly modelPatch$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelPatchAction<M>>(this._actionTypes.PATCH),
      concatMap(action =>
        this._manager.patch(action.payload.item.id, action.payload.item)
          .pipe(
            map((item: M) => createAction<A>(this._actionTypes.CREATE_SUCCESS, {item})),
            catchError(error => obsOf(createAction<A>(this._actionTypes.CREATE_FAILURE, {error})))
          )
      )
    );

  protected readonly modelDelete$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelDeleteAction<M>>(this._actionTypes.DELETE),
      concatMap(action =>
        this._manager.delete(action.payload.item.id)
          .pipe(
            map(() =>
              createAction<A>(this._actionTypes.DELETE_SUCCESS, {item: action.payload.item})),
            catchError(error => obsOf(createAction<A>(this._actionTypes.DELETE_FAILURE, {error})))
          )
      )
    );

  protected readonly modelDeleteAll$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelDeleteAllAction<M>>(this._actionTypes.DELETE_ALL),
      concatMap(action =>
        this._manager.deleteAll(action.payload.items.map(i => i.id))
          .pipe(
            map(() =>
              createAction<A>(this._actionTypes.DELETE_ALL_SUCCESS, {items: action.payload.items})),
            catchError(error =>
              obsOf(createAction<A>(this._actionTypes.DELETE_ALL_FAILURE, {error})))
          )
      )
    );

  protected readonly modelQuery$: Observable<A> = this._actions
    .pipe(
      ofType<ModelActions.ModelQueryAction>(this._actionTypes.QUERY),
      concatMap(action =>
        this._manager.query(action.payload.params)
          .pipe(
            map((result: ModelListResult<M>) =>
              createAction<A>(this._actionTypes.QUERY_SUCCESS, {result})),
            catchError(error => obsOf(createAction<A>(this._actionTypes.QUERY_FAILURE, {error})))
          )
      )
    );

  constructor(
    protected _actions: Actions,
    protected _service: ModelService<M, S, AT>,
    protected _manager: ModelManager<M>,
    private _actionTypes: AT,
  ) { }
}
