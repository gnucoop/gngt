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
import {catchError, map, switchMap} from 'rxjs/operators';

import {Action} from '@ngrx/store';
import {Actions, ofType} from '@ngrx/effects';

import * as ModelActions from './model-actions';
import {ModelListResult} from './list-result';
import {Model} from './model';
import {ModelManager} from './model-manager';
import {ModelService} from './model-service';
import * as fromModel from './model-reducer';


export abstract class ModelEffects<
    M extends Model,
    S extends fromModel.State<M>,
    A extends Action,
    A1 extends ModelActions.ModelGetAction,
    A2 extends ModelActions.ModelListAction,
    A3 extends ModelActions.ModelCreateAction<M>,
    A4 extends ModelActions.ModelUpdateAction<M>,
    A5 extends ModelActions.ModelPatchAction<M>,
    A6 extends ModelActions.ModelDeleteAction<M>,
    A7 extends ModelActions.ModelDeleteAllAction<M>> {

  protected readonly modelGet$: Observable<A> = this._actions
    .pipe(
      ofType<A1>(this._params.getActionType),
      switchMap(action =>
        this._manager.get(action.payload.id)
          .pipe(
            map((item: M) => new this._params.getSuccessAction({item})),
            catchError(error => obsOf(new this._params.getFailureAction({error})))
          )
      )
    );

  protected readonly modelList$: Observable<A> = this._actions
    .pipe(
      ofType<A2>(this._params.listActionType),
      switchMap(action =>
        this._manager.list(action.payload.params)
          .pipe(
            map((result: ModelListResult<M>) => new this._params.listSuccessAction({result})),
            catchError(error => obsOf(new this._params.listFailureAction({error})))
          )
      )
    );

  protected readonly modelCreate$: Observable<A> = this._actions
    .pipe(
      ofType<A3>(this._params.createActionType),
      switchMap(action =>
        this._manager.create(action.payload.item)
          .pipe(
            map((item: M) => new this._params.createSuccessAction({item})),
            catchError(error => obsOf(new this._params.createFailureAction({error})))
          )
      )
    );

  protected readonly modelUpdate$: Observable<A> = this._actions
    .pipe(
      ofType<A4>(this._params.updateActionType),
      switchMap(action =>
        this._manager.update(action.payload.item.id, action.payload.item)
          .pipe(
            map((item: M) => new this._params.updateSuccessAction({item})),
            catchError(error => obsOf(new this._params.updateFailureAction({error})))
          )
      )
    );

  protected readonly modelPatch$: Observable<A> = this._actions
    .pipe(
      ofType<A5>(this._params.patchActionType),
      switchMap(action =>
        this._manager.patch(action.payload.item.id, action.payload.item)
          .pipe(
            map((item: M) => new this._params.patchSuccessAction({item})),
            catchError(error => obsOf(new this._params.patchFailureAction({error})))
          )
      )
    );

  protected readonly modelDelete$: Observable<A> = this._actions
    .pipe(
      ofType<A6>(this._params.deleteActionType),
      switchMap(action =>
        this._manager.delete(action.payload.item.id)
          .pipe(
            map(() => new this._params.deleteSuccessAction({item: action.payload.item})),
            catchError(error => obsOf(new this._params.deleteFailureAction({error})))
          )
      )
    );

  protected readonly modelDeleteAll$: Observable<A> = this._actions
    .pipe(
      ofType<A7>(this._params.deleteAllActionType),
      switchMap(action =>
        this._manager.deleteAll(action.payload.items.map(i => i.id))
          .pipe(
            map(() => new this._params.deleteAllSuccessAction({items: action.payload.items})),
            catchError(error => obsOf(new this._params.deleteAllFailureAction({error})))
          )
      )
    );

  constructor(
    protected _actions: Actions,
    protected _service: ModelService<M, S, A1, A2, A3, A4, A5, A6, A7>,
    protected _manager: ModelManager<M>,
    private _params: {
      getActionType: string,
      getSuccessAction: new (p: {item: M}) => A,
      getFailureAction: new (p: {error: any}) => A,
      listActionType: string,
      listSuccessAction: new (p: {result: ModelListResult<M>}) => A,
      listFailureAction: new (p: {error: any}) => A,
      createActionType: string,
      createSuccessAction: new (p: {item: M}) => A,
      createFailureAction: new (p: {error: any}) => A,
      updateActionType: string,
      updateSuccessAction: new (p: {item: M}) => A,
      updateFailureAction: new (p: {error: any}) => A,
      patchActionType: string,
      patchSuccessAction: new (p: {item: M}) => A,
      patchFailureAction: new (p: {error: any}) => A,
      deleteActionType: string,
      deleteSuccessAction: new (p: {item: M}) => A,
      deleteFailureAction: new (p: {error: any}) => A,
      deleteAllActionType: string,
      deleteAllSuccessAction: new (p: {items: M[]}) => A,
      deleteAllFailureAction: new (p: {error: any}) => A
    }
  ) { }
}
