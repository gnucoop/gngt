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

import {Observable, of as obsOf, throwError} from 'rxjs';
import {filter, map, mergeMap} from 'rxjs/operators';

import {Actions, ofType} from '@ngrx/effects';
import {createSelector, createFeatureSelector, MemoizedSelector, select, Store} from '@ngrx/store';

import * as fromRoot from '@gngt/core/reducers';

import {
  Model, ModelGetParams, ModelListParams, ModelListResult, ModelQueryParams
} from '@gngt/core/common';
import * as ModelActions from './model-actions';
import {ModelGenericAction} from './model-generic-action';
import * as fromModel from './reducers';
import {createAction} from './utils';

function getActionResult<R>(
  actions: Actions<ModelGenericAction>,
  successType: string,
  failureType: string,
  uuid: string,
): Observable<R> {
  return actions.pipe(
    ofType(successType, failureType),
    filter(action => action.uuid === uuid),
    mergeMap(action => {
      if (action.type === failureType) {
        return throwError(action.payload);
      }
      return obsOf(action.payload);
    }),
  );
}

export abstract class ModelService<
  T extends Model,
  S extends fromModel.State<T>,
  A extends ModelActions.ModelActionTypes> {
  protected _modelState: MemoizedSelector<object, S>;

  constructor(
    protected _store: Store<fromRoot.State>,
    private _actions: Actions<ModelGenericAction>,
    private _actionTypes: A,
    statePrefixes: [string, string]
  ) {
    const packageState = createFeatureSelector(statePrefixes[0]);
    this._modelState = createSelector(packageState, s => <S>(<any>s)[statePrefixes[1]]);
  }

  getGetLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.get.loading))
    );
  }

  getGetOptions(): Observable<ModelGetParams> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.get.options))
    );
  }

  getGetId(): Observable<number | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.get.id))
    );
  }

  getGetObject(): Observable<T | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.get.object))
    );
  }

  getGetError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.get.error))
    );
  }

  getListLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.list.loading))
    );
  }

  getListOptions(): Observable<ModelListParams> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.list.options))
    );
  }

  getListObjects(): Observable<ModelListResult<T> | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.list.objects))
    );
  }

  getListError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.list.error))
    );
  }

  getListHasNext(): Observable<any> {
    return this._store.pipe(select(createSelector(
      this._modelState, (state) => state.list.objects && state.list.objects.next
    )));
  }

  getListCurrentStart(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => {
        if (state.list.options && state.list.options.start != null) {
          return state.list.options.start;
        }
        return 1;
      }))
    );
  }

  getCreateLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.create.loading))
    );
  }

  getCreateObject(): Observable<T | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.create.object))
    );
  }

  getCreateError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.create.error))
    );
  }

  getUpdateLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.update.loading))
    );
  }

  getUpdateId(): Observable<number | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.update.id))
    );
  }

  getUpdateObject(): Observable<T | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.update.object))
    );
  }

  getUpdateError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.update.error))
    );
  }

  getPatchLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.patch.loading))
    );
  }

  getPatchId(): Observable<number | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.patch.id))
    );
  }

  getPatchObject(): Observable<T | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.patch.object))
    );
  }

  getPatchError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.patch.error))
    );
  }

  getDeleteLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.delete.loading))
    );
  }

  getDeleteId(): Observable<number | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.delete.id))
    );
  }

  getDeleteObject(): Observable<T | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.delete.object))
    );
  }

  getDeleteError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.delete.error))
    );
  }

  getDeleteAllLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.deleteAll.loading))
    );
  }

  getDeleteAllIds(): Observable<number[] | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.deleteAll.ids))
    );
  }

  getDeleteAllObjects(): Observable<T[] | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.deleteAll.objects))
    );
  }

  getDeleteAllError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.deleteAll.error))
    );
  }

  getQueryLoading(): Observable<boolean> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.query.loading))
    );
  }

  getQueryOptions(): Observable<ModelQueryParams | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.query.options))
    );
  }

  getQueryObjects(): Observable<ModelListResult<T> | null> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.query.objects))
    );
  }

  getQueryError(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => state.query.error))
    );
  }

  getQueryHasNext(): Observable<any> {
    return this._store.pipe(select(createSelector(
      this._modelState, (state) => state.query.objects && state.query.objects.next
    )));
  }

  getQueryCurrentStart(): Observable<any> {
    return this._store.pipe(
      select(createSelector(this._modelState, (state) => {
        if (state.query.options && state.query.options.start != null) {
          return state.query.options.start;
        }
        return 1;
      }))
    );
  }

  getCreateSuccess(): Observable<ModelActions.ModelCreateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(this._actionTypes.CREATE_SUCCESS),
    );
  }

  getUpdateSuccess(): Observable<ModelActions.ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(this._actionTypes.UPDATE_SUCCESS),
    );
  }

  getPatchSuccess(): Observable<ModelActions.ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(this._actionTypes.PATCH_SUCCESS),
    );
  }

  getDeleteSuccess(): Observable<ModelActions.ModelDeleteSuccessAction<T>> {
    return this._actions.pipe(
      ofType(this._actionTypes.DELETE_SUCCESS),
    );
  }

  getDeleteAllSuccess(): Observable<ModelActions.ModelDeleteAllSuccessAction<T>> {
    return this._actions.pipe(
      ofType(this._actionTypes.DELETE_ALL_SUCCESS),
    );
  }

  get(id: number): Observable<T> {
    const action = createAction<ModelActions.ModelGetAction>({
      type: this._actionTypes.GET,
      payload: {id}
    });
    this._store.dispatch(action);
    return getActionResult<{item: T}>(
      this._actions,
      this._actionTypes.GET_SUCCESS,
      this._actionTypes.GET_FAILURE,
      action.uuid
    ).pipe(map(r => r.item));
  }

  list(options?: ModelListParams): Observable<ModelListResult<T>> {
    const action = createAction<ModelActions.ModelListAction>({
      type: this._actionTypes.LIST,
      payload: {params: options || {}}
    });
    this._store.dispatch(action);
    return getActionResult<{result: ModelListResult<T>}>(
      this._actions,
      this._actionTypes.LIST_SUCCESS,
      this._actionTypes.LIST_FAILURE,
      action.uuid
    ).pipe(map(r => r.result));
  }

  create(data: Partial<T>): Observable<T> {
    const action = createAction<ModelActions.ModelCreateAction<T>>({
      type: this._actionTypes.CREATE,
      payload: {item: data},
    });
    this._store.dispatch(action);
    return getActionResult<{item: T}>(
      this._actions,
      this._actionTypes.CREATE_SUCCESS,
      this._actionTypes.CREATE_FAILURE,
      action.uuid
    ).pipe(map(r => r.item));
  }

  update(data: T): Observable<T> {
    const action = createAction<ModelActions.ModelUpdateAction<T>>({
      type: this._actionTypes.UPDATE,
      payload: {item: data},
    });
    this._store.dispatch(action);
    return getActionResult<{item: T}>(
      this._actions,
      this._actionTypes.UPDATE_SUCCESS,
      this._actionTypes.UPDATE_FAILURE,
      action.uuid
    ).pipe(map(r => r.item));
  }

  patch(data: T): Observable<T> {
    const action = createAction<ModelActions.ModelPatchAction<T>>({
      type: this._actionTypes.PATCH,
      payload: {item: data}
    });
    this._store.dispatch(action);
    return getActionResult<{item: T}>(
      this._actions,
      this._actionTypes.PATCH_SUCCESS,
      this._actionTypes.PATCH_FAILURE,
      action.uuid
    ).pipe(map(r => r.item));
  }

  delete(data: T): Observable<T> {
    const action = createAction<ModelActions.ModelDeleteAction<T>>({
      type: this._actionTypes.DELETE,
      payload: {item: data}
    });
    this._store.dispatch(action);
    return getActionResult<{item: T}>(
      this._actions,
      this._actionTypes.DELETE_SUCCESS,
      this._actionTypes.DELETE_FAILURE,
      action.uuid
    ).pipe(map(r => r.item));
  }

  deleteAll(data: T[]): Observable<T[]> {
    const action = createAction<ModelActions.ModelDeleteAllAction<T>>({
      type: this._actionTypes.DELETE_ALL,
      payload: {items: data}
    });
    this._store.dispatch(action);
    return getActionResult<{items: T[]}>(
      this._actions,
      this._actionTypes.DELETE_ALL_SUCCESS,
      this._actionTypes.DELETE_ALL_FAILURE,
      action.uuid
    ).pipe(map(r => r.items));
  }

  query(options: ModelQueryParams): Observable<ModelListResult<T>> {
    const action = createAction<ModelActions.ModelQueryAction>({
      type: this._actionTypes.QUERY,
      payload: {params: options || {}}
    });
    this._store.dispatch(action);
    return getActionResult<{result: ModelListResult<T>}>(
      this._actions,
      this._actionTypes.QUERY_SUCCESS,
      this._actionTypes.QUERY_FAILURE,
      action.uuid
    ).pipe(map(r => r.result));
  }
}
