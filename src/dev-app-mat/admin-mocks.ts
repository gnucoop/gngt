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

import {Observable, of as obsOf, Subject} from 'rxjs';

import {ModelListResult} from '@gngt/core/model';

export class AdminModel {
  id: number;
  foo: string;
  bar: string;
  baz: number;
}

const demoObjs: AdminModel[] = [
  { id: 1, foo: 'demo foo 1', bar: 'demo bar 1', baz: 4 },
  { id: 2, foo: 'demo foo 2', bar: 'demo bar 2', baz: 5 },
  { id: 3, foo: 'demo foo 3', bar: 'demo bar 3', baz: 56 }
];

export class AdminModelMockService {
  private _subject: Subject<AdminModel> = new Subject<AdminModel>();

  get(_id: number): void {}

  list(): void { }

  getGetObject(): Observable<AdminModel> {
    return obsOf(demoObjs[0]);
  }

  getListObjects(): Observable<ModelListResult<AdminModel>> {
    return obsOf({
      count: demoObjs.length,
      results: demoObjs,
      next: null,
      previous: null,
      hasNext: false
    });
  }

  getCreateSuccess(): Observable<AdminModel | null> {
    return this._subject.asObservable();
  }

  getPatchSuccess(): Observable<AdminModel | null> {
    return this._subject.asObservable();
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

  getDeleteSuccess(): Observable<boolean> {
    return obsOf(true);
  }

  getDeleteAllSuccess(): Observable<boolean> {
    return obsOf(true);
  }
}
