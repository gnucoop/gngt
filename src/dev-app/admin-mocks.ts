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

import {EventEmitter} from '@angular/core';
import {ModelListParams, ModelListResult} from '@gngt/core/common';
import {Observable, of as obsOf} from 'rxjs';
import {switchMap} from 'rxjs/operators';

export class AdminModel {
  id: number;
  foo: string;
  bar: string;
  baz: number;
}

export class AdminModelMockService {
  private _listEvt: EventEmitter<void> = new EventEmitter<void>();
  private _currentStart = 0;
  private _currentLimit = 20;

  delete() {}

  get(_id: number): Observable<AdminModel> {
    return obsOf({id: 1, foo: 'foo', bar: 'bar', baz: 1});
  }

  getListObjects(): Observable<ModelListResult<AdminModel>> {
    return this._listEvt.pipe(
        switchMap(_ => {
          return this._returnObjects();
        }),
    );
  }

  list(params: ModelListParams): void {
    this._setListParams(params);
    this._listEvt.emit();
  }

  query(params: ModelListParams): Observable<ModelListResult<AdminModel>> {
    this._setListParams(params);
    return this._returnObjects();
  }

  private _setListParams(params: ModelListParams): void {
    this._currentStart = params.start != null ? params.start : 0;
    this._currentLimit = params.limit != null ? params.limit : 20;
  }

  private _returnObjects(): Observable<ModelListResult<AdminModel>> {
    const objs: AdminModel[] = [];
    for (let i = 0; i < this._currentLimit; i++) {
      const id = this._currentStart + i + 1;
      objs.push({id, foo: `foo ${id}`, bar: `bar ${id}`, baz: id});
    }
    const res = {
      count: 200,
      results: objs,
      next: this._currentStart + this._currentLimit < 200 ? '' : null,
      previous: this._currentStart === 0 ? null : ''
    };
    return obsOf(res);
  }
}
