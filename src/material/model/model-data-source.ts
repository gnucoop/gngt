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
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';

import {BehaviorSubject, combineLatest, Observable, of as obsOf, Subscription} from 'rxjs';
import {debounceTime, map, startWith, switchMap, tap} from 'rxjs/operators';

import {
  Model, ModelActions, ModelListParams, ModelQueryParams, ModelService, reducers as fromModel
} from '@gngt/core/model';

import {ModelDataSourceFilters} from './model-data-source-filters';

export class ModelDataSource<
      T extends Model,
      S extends fromModel.State<T>,
      A extends ModelActions.ModelActionTypes,
      MS extends ModelService<T, S, A>
    > extends DataSource<T> {
  constructor(private _service: MS, private _baseParams: ModelListParams = {}) {
    super();
  }

  get sort(): MatSort | null { return this._sort; }
  set sort(sort: MatSort | null) {
    this._sort = sort;
    this._updateSort();
  }
  private _sort: MatSort | null = null;

  get filter(): string { return this._filter.value; }
  set filter(filter: string) {
    this._filter.next(filter);
  }
  private _filter: BehaviorSubject<string> = new BehaviorSubject<string>('');

  get filters(): ModelDataSourceFilters {
    return this._filters.value; }
  set filters(filters: ModelDataSourceFilters) {
    this._filters.next(filters);
  }
  private _filters: BehaviorSubject<ModelDataSourceFilters>
    = new BehaviorSubject<ModelDataSourceFilters>({});

  get paginator(): MatPaginator | null { return this._paginator; }
  set paginator(paginator: MatPaginator|null) {
    this._paginator = paginator;
    this._updatePaginator();
  }
  private _paginator: MatPaginator | null = null;

  private _data: BehaviorSubject<T[]> = new BehaviorSubject<T[]>([]);
  get data(): T[] { return this._data.value; }

  private _dataModifier: (data: T[]) => Observable<T[]>;
  set dataModifier(dataModifier: (data: T[]) => Observable<T[]>) {
    this._dataModifier = dataModifier;
  }

  private _sortParams: BehaviorSubject<Sort | null> = new BehaviorSubject<Sort | null>(null);
  private _sortSubscription: Subscription = Subscription.EMPTY;
  private _paginatorParams: BehaviorSubject<PageEvent | null> =
    new BehaviorSubject<PageEvent | null>(null);
  private _paginatorSubscription: Subscription = Subscription.EMPTY;
  private _dataSubscription: Subscription = Subscription.EMPTY;
  private _refreshEvent: EventEmitter<void> = new EventEmitter<void>();

  connect(_: CollectionViewer): Observable<T[]> {
    this._initData();
    return this._data.asObservable();
  }

  disconnect(_: CollectionViewer): void {
    this._dataSubscription.unsubscribe();
    this._sortSubscription.unsubscribe();
    this._paginatorSubscription.unsubscribe();
    this._sortParams.complete();
    this._paginatorParams.complete();
    this._filters.complete();
  }

  refresh(): void {
    this._refreshEvent.next();
  }

  private _initData(): void {
    this._dataSubscription = combineLatest(
      this._paginatorParams, this._sortParams, this._filter,
      this._filters, this._refreshEvent
    ).pipe(
      startWith([null, null, null, null]),
      debounceTime(10),
      switchMap(p => {
        const pagination = p[0];
        const sort = p[1];
        const filters = p[3];
        const params: ModelQueryParams = {...this._baseParams, selector: {...filters}};
        if (pagination != null) {
          const pag = pagination as PageEvent;
          params.limit = pag.pageSize;
          params.start = pag.pageIndex * pag.pageSize;
        }
        if (sort != null) {
          const so = sort as Sort;
          const direction: 'asc' | 'desc' = so.direction === '' ? 'asc' : so.direction;
          params.sort = {[so.active]: direction};
        }
        return this._service.query(params);
      }),
      tap(o => {
        const paginator = this.paginator;
        if (paginator != null) {
          paginator.length = o && o.count ? o.count : 0;
        }
      }),
      map(o => o && o.results ? o.results : []),
      switchMap(data => {
        if (this._dataModifier != null) {
          return this._dataModifier(data);
        }
        return obsOf(data);
      })
    ).subscribe(data => {
      this._data.next(data);
    });

    this._refreshEvent.next();
  }

  private _updateSort(): void {
    this._sortSubscription.unsubscribe();
    this._sortSubscription = this._sort != null ?
      this._sort.sortChange.subscribe(this._sortParams) :
      Subscription.EMPTY;
  }

  private _updatePaginator(): void {
    this._paginatorSubscription.unsubscribe();
    this._paginatorSubscription = this._paginator != null ?
      this._paginator.page.subscribe(this._paginatorParams) :
      Subscription.EMPTY;
  }
}
