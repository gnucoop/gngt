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

import {
  Model,
  ModelGetParams,
  ModelListParams,
  ModelListResult,
  ModelQueryParams
} from '@gngt/core/common';
import * as fromRoot from '@gngt/core/reducers';
import {Actions, ofType} from '@ngrx/effects';
import {createFeatureSelector, createSelector, MemoizedSelector, select, Store} from '@ngrx/store';
import {Observable, pipe, throwError, UnaryFunction} from 'rxjs';
import {filter, map, switchMap, take, tap} from 'rxjs/operators';

import {
  ModelActionTypes,
  ModelCreateAction,
  ModelCreateSuccessAction,
  ModelDeleteAction,
  ModelDeleteAllAction,
  ModelDeleteAllSuccessAction,
  ModelDeleteSuccessAction,
  ModelGetAction,
  ModelListAction,
  ModelPatchAction,
  ModelQueryAction,
  ModelUpdateAction,
  ModelUpdateSuccessAction,
} from './model-actions';
import {ModelError} from './model-error';
import {ModelGenericAction} from './model-generic-action';
import * as fromModel from './reducers';
import {createAction} from './utils';

export abstract class ModelService<
    T extends Model = Model, S extends fromModel.State<T> = fromModel.State<T>,
                                       A extends ModelActionTypes = ModelActionTypes> {
  protected _modelState: MemoizedSelector<object, S>;

  private _lastGetEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelGetState<T>>>;
  private _lastListEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelListState<T>>>;
  private _lastCreateEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelCreateState<T>>>;
  private _lastPatchEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelPatchState<T>>>;
  private _lastUpdateEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelUpdateState<T>>>;
  private _lastDeleteEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelDeleteState<T>>>;
  private _lastDeleteAllEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelDeleteAllState<T>>>;
  private _lastQueryEntry:
      UnaryFunction<Observable<fromRoot.State>, Observable<fromModel.ModelQueryState<T>>>;

  constructor(
      protected _store: Store<fromRoot.State>, protected _actions: Actions<ModelGenericAction>,
      private _actionTypes: A, statePrefixes: [string, string]) {
    const packageState = createFeatureSelector(statePrefixes[0]);
    this._modelState = createSelector(packageState, s => <S>(<any>s)[statePrefixes[1]]);

    this._lastGetEntry = pipe(
        select(createSelector(this._modelState, (state) => state.get)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastListEntry = pipe(
        select(createSelector(this._modelState, (state) => state.list)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastCreateEntry = pipe(
        select(createSelector(this._modelState, (state) => state.create)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastPatchEntry = pipe(
        select(createSelector(this._modelState, (state) => state.patch)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastUpdateEntry = pipe(
        select(createSelector(this._modelState, (state) => state.update)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastDeleteEntry = pipe(
        select(createSelector(this._modelState, (state) => state.delete)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastDeleteAllEntry = pipe(
        select(createSelector(this._modelState, (state) => state.deleteAll)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
    this._lastQueryEntry = pipe(
        select(createSelector(this._modelState, (state) => state.query)),
        filter(g => g.length > 0),
        map(g => g[0]),
    );
  }

  getGetLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastGetEntry,
        map(g => g.loading),
    );
  }

  getGetOptions(): Observable<ModelGetParams> {
    return this._store.pipe(
        this._lastGetEntry,
        map(g => g.options),
    );
  }

  getGetId(): Observable<number|null> {
    return this._store.pipe(
        this._lastGetEntry,
        map(g => g.id),
    );
  }

  getGetObject(): Observable<T|null> {
    return this._store.pipe(
        this._lastGetEntry,
        map(g => g.object),
    );
  }

  getGetError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastGetEntry,
        map(g => g.error),
    );
  }

  getListLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastListEntry,
        map(g => g.loading),
    );
  }

  getListOptions(): Observable<ModelListParams> {
    return this._store.pipe(
        this._lastListEntry,
        map(g => g.options),
    );
  }

  getListObjects(): Observable<ModelListResult<T>|null> {
    return this._store.pipe(
        this._lastListEntry,
        map(g => g.objects),
    );
  }

  getListError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastListEntry,
        map(g => g.error),
    );
  }

  getListHasNext(): Observable<boolean> {
    return this._store.pipe(
        this._lastListEntry,
        map(g => g.objects != null && g.objects!.next != null),
    );
  }

  getListCurrentStart(): Observable<number> {
    return this._store.pipe(
        this._lastListEntry,
        filter(g => g.options != null),
        map(g => g.options!.start != null ? g.options!.start : 1),
    );
  }

  getCreateLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastCreateEntry,
        map(g => g.loading),
    );
  }

  getCreateObject(): Observable<T|null> {
    return this._store.pipe(
        this._lastCreateEntry,
        map(g => g.object),
    );
  }

  getCreateError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastCreateEntry,
        map(g => g.error),
    );
  }

  getUpdateLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastUpdateEntry,
        map(g => g.loading),
    );
  }

  getUpdateId(): Observable<number|null> {
    return this._store.pipe(
        this._lastUpdateEntry,
        map(g => g.id),
    );
  }

  getUpdateObject(): Observable<T|null> {
    return this._store.pipe(
        this._lastUpdateEntry,
        map(g => g.object),
    );
  }

  getUpdateError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastUpdateEntry,
        map(g => g.error),
    );
  }

  getPatchLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastPatchEntry,
        map(g => g.loading),
    );
  }

  getPatchId(): Observable<number|null> {
    return this._store.pipe(
        this._lastPatchEntry,
        map(g => g.id),
    );
  }

  getPatchObject(): Observable<T|null> {
    return this._store.pipe(
        this._lastPatchEntry,
        map(g => g.object),
    );
  }

  getPatchError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastPatchEntry,
        map(g => g.error),
    );
  }

  getDeleteLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastDeleteEntry,
        map(g => g.loading),
    );
  }

  getDeleteId(): Observable<number|null> {
    return this._store.pipe(
        this._lastDeleteEntry,
        map(g => g.id),
    );
  }

  getDeleteObject(): Observable<T|null> {
    return this._store.pipe(
        this._lastDeleteEntry,
        map(g => g.object),
    );
  }

  getDeleteError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastDeleteEntry,
        map(g => g.error),
    );
  }

  getDeleteAllLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastDeleteAllEntry,
        map(g => g.loading),
    );
  }

  getDeleteAllIds(): Observable<number[]|null> {
    return this._store.pipe(
        this._lastDeleteAllEntry,
        map(g => g.ids),
    );
  }

  getDeleteAllObjects(): Observable<T[]|null> {
    return this._store.pipe(
        this._lastDeleteAllEntry,
        map(g => g.objects),
    );
  }

  getDeleteAllError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastDeleteAllEntry,
        map(g => g.error),
    );
  }

  getQueryLoading(): Observable<boolean> {
    return this._store.pipe(
        this._lastQueryEntry,
        map(g => g.loading),
    );
  }

  getQueryOptions(): Observable<ModelQueryParams|null> {
    return this._store.pipe(
        this._lastQueryEntry,
        map(g => g.options),
    );
  }

  getQueryObjects(): Observable<ModelListResult<T>|null> {
    return this._store.pipe(
        this._lastQueryEntry,
        map(g => g.objects),
    );
  }

  getQueryError(): Observable<ModelError|null> {
    return this._store.pipe(
        this._lastQueryEntry,
        map(g => g.error),
    );
  }

  getQueryHasNext(): Observable<boolean> {
    return this._store.pipe(
        this._lastQueryEntry,
        map(g => g.objects != null && g.objects!.next != null),
    );
  }

  getQueryCurrentStart(): Observable<number> {
    return this._store.pipe(
        this._lastQueryEntry,
        filter(g => g.options != null),
        map(g => g.options!.start != null ? g.options!.start : 1),
    );
  }

  getCreateSuccess(): Observable<ModelCreateSuccessAction<T>> {
    return this._actions.pipe(
        ofType(this._actionTypes.CREATE_SUCCESS),
    );
  }

  getUpdateSuccess(): Observable<ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
        ofType(this._actionTypes.UPDATE_SUCCESS),
    );
  }

  getPatchSuccess(): Observable<ModelUpdateSuccessAction<T>> {
    return this._actions.pipe(
        ofType(this._actionTypes.PATCH_SUCCESS),
    );
  }

  getDeleteSuccess(): Observable<ModelDeleteSuccessAction<T>> {
    return this._actions.pipe(
        ofType(this._actionTypes.DELETE_SUCCESS),
    );
  }

  getDeleteAllSuccess(): Observable<ModelDeleteAllSuccessAction<T>> {
    return this._actions.pipe(
        ofType(this._actionTypes.DELETE_ALL_SUCCESS),
    );
  }

  get(id: number): Observable<T> {
    const action = createAction<ModelGetAction>({type: this._actionTypes.GET, payload: {id}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.GET_SUCCESS, this._actionTypes.GET_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.get)),
        map(gets => gets.find(g => g.uuid === action.uuid)),
        filter(get => get != null),
        tap(get => {
          if (get!.error != null) {
            throwError(get!.error);
          }
        }),
        filter(get => get!.object != null),
        map(get => get!.object!),
        take(1),
    );
  }

  list(options?: ModelListParams): Observable<ModelListResult<T>> {
    const action = createAction<ModelListAction>(
        {type: this._actionTypes.LIST, payload: {params: options || {}}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.LIST_SUCCESS, this._actionTypes.LIST_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.list)),
        map(lists => lists.find(l => l.uuid === action.uuid)),
        filter(list => list != null),
        tap(list => {
          if (list!.error != null) {
            throwError(list!.error);
          }
        }),
        filter(list => list!.objects != null),
        map(list => list!.objects!),
        take(1),
    );
  }

  create(data: Partial<T>): Observable<T> {
    const action = createAction<ModelCreateAction<T>>({
      type: this._actionTypes.CREATE,
      payload: {item: data},
    });
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.CREATE_SUCCESS, this._actionTypes.CREATE_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.create)),
        map(creates => creates.find(c => c.uuid === action.uuid)),
        filter(creates => creates != null),
        tap(create => {
          if (create!.error != null) {
            throwError(create!.error);
          }
        }),
        filter(create => create!.object != null),
        map(create => create!.object!),
        take(1),
    );
  }

  update(data: T): Observable<T> {
    const action = createAction<ModelUpdateAction<T>>({
      type: this._actionTypes.UPDATE,
      payload: {item: data},
    });
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.UPDATE_SUCCESS, this._actionTypes.UPDATE_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.update)),
        map(updates => updates.find(u => u.uuid === action.uuid)),
        filter(updates => updates != null),
        tap(update => {
          if (update!.error != null) {
            throwError(update!.error);
          }
        }),
        filter(update => update!.object != null),
        map(update => update!.object!),
        take(1),
    );
  }

  patch(data: T): Observable<T> {
    const action =
        createAction<ModelPatchAction<T>>({type: this._actionTypes.PATCH, payload: {item: data}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.PATCH_SUCCESS, this._actionTypes.PATCH_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.patch)),
        map(patches => patches.find(p => p.uuid === action.uuid)),
        filter(patches => patches != null),
        tap(patch => {
          if (patch!.error != null) {
            throwError(patch!.error);
          }
        }),
        filter(patch => patch!.object != null),
        map(patch => patch!.object!),
        take(1),
    );
  }

  delete(data: T): Observable<T> {
    const action =
        createAction<ModelDeleteAction<T>>({type: this._actionTypes.DELETE, payload: {item: data}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.DELETE_SUCCESS, this._actionTypes.DELETE_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.delete)),
        map(dels => dels.find(d => d.uuid === action.uuid)),
        filter(dels => dels != null),
        tap(del => {
          if (del!.error != null) {
            throwError(del!.error);
          }
        }),
        filter(del => del!.object != null),
        map(del => del!.object!),
        take(1),
    );
  }

  deleteAll(data: T[]): Observable<T[]> {
    const action = createAction<ModelDeleteAllAction<T>>(
        {type: this._actionTypes.DELETE_ALL, payload: {items: data}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.DELETE_ALL_SUCCESS, this._actionTypes.DELETE_ALL_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.deleteAll)),
        map(deleteAlls => deleteAlls.find(d => d.uuid === action.uuid)),
        filter(deleteAlls => deleteAlls != null),
        tap(deleteAll => {
          if (deleteAll!.error != null) {
            throwError(deleteAll!.error);
          }
        }),
        filter(deleteAll => deleteAll!.objects != null),
        map(deleteAll => deleteAll!.objects!),
        take(1),
    );
  }

  query(options: ModelQueryParams): Observable<ModelListResult<T>> {
    const action = createAction<ModelQueryAction>(
        {type: this._actionTypes.QUERY, payload: {params: options || {}}});
    this._store.dispatch(action);
    const actResult = this._actions.pipe(
        ofType(this._actionTypes.QUERY_SUCCESS, this._actionTypes.QUERY_FAILURE),
        filter(a => a.uuid === action.uuid),
    );
    return actResult.pipe(
        switchMap(() => this._store),
        select(createSelector(this._modelState, (state) => state.query)),
        map(queries => queries.find(q => q.uuid === action.uuid)),
        filter(queries => queries != null),
        tap(query => {
          if (query!.error != null) {
            throwError(query!.error);
          }
        }),
        filter(query => query!.objects != null),
        map(query => query!.objects!),
        take(1),
    );
  }
}
