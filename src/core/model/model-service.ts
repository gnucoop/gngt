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

import {Observable} from 'rxjs';

import {Actions, ofType} from '@ngrx/effects';
import {createSelector, createFeatureSelector, MemoizedSelector, select, Store} from '@ngrx/store';

import * as fromRoot from '@gngt/core/reducers';

import {
  Model, ModelGetParams, ModelListParams, ModelListResult, ModelQueryParams
} from '@gngt/core/common';
import * as ModelActions from './model-actions';
import * as fromModel from './reducers';
import {createAction} from './utils';

export abstract class ModelService<
  T extends Model,
  S extends fromModel.State<T>,
  A extends ModelActions.ModelActionTypes> {
  protected _modelState: MemoizedSelector<object, S>;

  constructor(
    protected _store: Store<fromRoot.State>,
    private _actions: Actions,
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

  get(id: number): void {
    this._store.dispatch(
      createAction<ModelActions.ModelGetAction>(this._actionTypes.GET, {id}));
  }

  list(options?: ModelListParams): void {
    this._store.dispatch(
      createAction<ModelActions.ModelListAction>(this._actionTypes.LIST, {params: options || {}}));
  }

  create(data: T): void {
    this._store.dispatch(
      createAction<ModelActions.ModelCreateAction<T>>(this._actionTypes.CREATE, {item: data}));
  }

  update(data: T): void {
    this._store.dispatch(
      createAction<ModelActions.ModelUpdateAction<T>>(this._actionTypes.UPDATE, {item: data}));
  }

  patch(data: T): void {
    this._store.dispatch(
      createAction<ModelActions.ModelPatchAction<T>>(this._actionTypes.PATCH, {item: data}));
  }

  delete(data: T): void {
    this._store.dispatch(
      createAction<ModelActions.ModelDeleteAction<T>>(this._actionTypes.DELETE, {item: data}));
  }

  deleteAll(data: T[]): void {
    this._store.dispatch(
      createAction<ModelActions.ModelDeleteAllAction<T>>(
        this._actionTypes.DELETE_ALL, {items: data}));
  }

  query(options: ModelQueryParams): void {
    this._store.dispatch(
      createAction<ModelActions.ModelQueryAction>(
        this._actionTypes.QUERY, {params: options || {}}));
  }
}
