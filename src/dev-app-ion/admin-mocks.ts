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

import {EventEmitter} from '@angular/core';

import {Observable, of as obsOf, Subject} from 'rxjs';
import {map} from 'rxjs/operators';

import {Action} from '@ngrx/store';

import {ModelListParams, ModelListResult} from '@gngt/core/model';

export class AdminModel {
  id: number;
  foo: string;
  bar: string;
  baz: number;
}

export class AdminModelMockService {
  private _subject: Subject<AdminModel> = new Subject<AdminModel>();
  private _actionSubject: Subject<Action> = new Subject<Action>();
  private _listEvt: EventEmitter<void> = new EventEmitter<void>();
  private _currentStart = 0;
  private _currentLimit = 20;

  get(_id: number): void {}

  list(params: ModelListParams): void {
    this._currentStart = params.start != null ? params.start : 0;
    this._currentLimit = params.limit != null ? params.limit : 20;
    this._listEvt.emit();
  }

  getGetObject(): Observable<AdminModel> {
    return obsOf({id: 1, foo: 'foo', bar: 'bar', baz: 1});
  }

  getListObjects(): Observable<ModelListResult<AdminModel>> {
    return this._listEvt.pipe(
      map(_ => {
        const objs: AdminModel[] = [];
        for (let i = 0 ; i < this._currentLimit ; i++) {
          const id = this._currentStart + i + 1;
          objs.push({id, foo: `foo ${id}`, bar: `bar ${id}`, baz: id});
        }
        const res = {
          count: 200,
          results: objs,
          next: this._currentStart + this._currentLimit < 200 ? '' : null,
          previous: this._currentStart === 0 ? null : ''
        };
        console.log(res);
        return res;
      })
    );
  }

  getCreateSuccess(): Observable<AdminModel | null> {
    return this._subject.asObservable();
  }

  getPatchSuccess(): Observable<AdminModel | null> {
    return this._subject.asObservable();
  }

  getDeleteSuccess(): Observable<Action> {
    return this._actionSubject.asObservable();
  }

  getDeleteAllSuccess(): Observable<Action> {
    return this._actionSubject.asObservable();
  }

  getGetLoading(): Observable<boolean> {
    return obsOf(false);
  }

  getCreateLoading(): Observable<boolean> {
    return obsOf(false);
  }

  getPatchLoading(): Observable<boolean> {
    return obsOf(false);
  }
}
