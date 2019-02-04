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

import {createSelector, createFeatureSelector, MemoizedSelector, select, Store} from '@ngrx/store';

import {Observable} from 'rxjs';

import {Actions, ofType} from '@ngrx/effects';

import * as fromRoot from '@gngt/core/reducers';

import {Model, ModelGetParams, ModelListParams, ModelListResult} from '@gngt/core/common';
import * as ModelActions from './model-actions';
import * as fromModel from './reducers';


function createGetAction<T extends ModelActions.ModelGetAction>(
  type: { new(p: {id: number}): T }, id: number
): T {
  return new type({id});
}
function createListAction<T extends ModelActions.ModelListAction>(
  type: { new(p: {params: ModelListParams}): T }, params: ModelListParams
): T {
  return new type({params});
}
function createCreateAction<T extends ModelActions.ModelCreateAction<M>, M extends Model>(
  type: { new(p: {item: M}): T }, item: M
): T {
  return new type({item});
}
function createUpdateAction<T extends ModelActions.ModelUpdateAction<M>, M extends Model>(
  type: { new(p: {item: M}): T }, item: M
): T {
  return new type({item});
}
function createPatchAction<T extends ModelActions.ModelPatchAction<M>, M extends Model>(
  type: { new(p: {item: M}): T }, item: M
): T {
  return new type({item});
}
function createDeleteAction<T extends ModelActions.ModelDeleteAction<M>, M extends Model>(
  type: { new(p: {item: M}): T }, item: M
): T {
  return new type({item});
}
function createDeleteAllAction<T extends ModelActions.ModelDeleteAllAction<M>, M extends Model>(
  type: { new(p: {items: M[]}): T }, items: M[]
): T {
  return new type({items});
}


export abstract class ModelService<
  T extends Model,
  S extends fromModel.State<T>,
  A1 extends ModelActions.ModelGetAction,
  A2 extends ModelActions.ModelListAction,
  A3 extends ModelActions.ModelCreateAction<T>,
  A4 extends ModelActions.ModelUpdateAction<T>,
  A5 extends ModelActions.ModelPatchAction<T>,
  A6 extends ModelActions.ModelDeleteAction<T>,
  A7 extends ModelActions.ModelDeleteAllAction<T>> {
  protected _modelState: MemoizedSelector<object, S>;

  constructor(
    protected _store: Store<fromRoot.State>,
    private _actions: Actions,
    private _getAction: { new(p: {id: number}): A1 },
    private _listAction: { new(p: {params: ModelListParams}): A2 },
    private _createAction: { new(p: {item: T}): A3 },
    private _updateAction: { new(p: {item: T}): A4 },
    private _patchAction: { new(p: {item: T}): A5 },
    private _deleteAction: { new(p: {item: T}): A6 },
    private _deleteAllAction: { new(p: {items: T[]}): A7 },
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

  getCreateSuccess(): Observable<ModelActions.ModelCreateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(new this._createAction(<any>null).type)
    );
  }

  getUpdateSuccess(): Observable<ModelActions.ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(new this._updateAction(<any>null).type)
    );
  }

  getPatchSuccess(): Observable<ModelActions.ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
      ofType(new this._patchAction(<any>null).type)
    );
  }

  getDeleteSuccess(): Observable<ModelActions.ModelDeleteSuccessAction<T>> {
    return this._actions.pipe(
      ofType(new this._deleteAction(<any>null).type)
    );
  }

  getDeleteAllSuccess(): Observable<ModelActions.ModelDeleteAllSuccessAction<T>> {
    return this._actions.pipe(
      ofType(new this._deleteAllAction(<any>null).type)
    );
  }

  get(id: number): void {
    this._store.dispatch(createGetAction<A1>(this._getAction, id));
  }

  list(options?: ModelListParams): void {
    this._store.dispatch(createListAction<A2>(this._listAction, options || {}));
  }

  create(data: T): void {
    this._store.dispatch(createCreateAction<A3, T>(this._createAction, data));
  }

  update(data: T): void {
    this._store.dispatch(createUpdateAction<A4, T>(this._updateAction, data));
  }

  patch(data: T): void {
    this._store.dispatch(createPatchAction<A5, T>(this._patchAction, data));
  }

  delete(data: T): void {
    this._store.dispatch(createDeleteAction<A6, T>(this._deleteAction, data));
  }

  deleteAll(data: T[]): void {
    this._store.dispatch(createDeleteAllAction<A7, T>(this._deleteAllAction, data));
  }
}
