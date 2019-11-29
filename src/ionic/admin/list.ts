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

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {AdminListComponent as BaseAdminListComponent} from '@gngt/core/admin';
import {mergeQueryParams} from '@gngt/core/common';
import {Model, ModelActions, ModelQueryParams, ModelService,
  reducers as fromModel} from '@gngt/core/model';
import {IonInfiniteScroll} from '@ionic/angular';

import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {AdminUserInteractionsService} from './admin-user-interactions';

@Component({
  moduleId: module.id,
  selector: 'gngt-admin-list',
  templateUrl: 'list.html',
  styleUrls: ['list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: [
    'baseEditUrl',
    'displayedColumns',
    'headers',
    'newItemPath',
    'service',
    'title',
  ]
})
export class AdminListComponent<
    T extends Model = Model,
    S extends fromModel.State<T> = fromModel.State<T>,
    A extends ModelActions.ModelActionTypes = ModelActions.ModelActionTypes,
    MS extends ModelService<T, S, A> = ModelService<T, S, A>
  > extends BaseAdminListComponent<T, S, A, MS>
    implements OnDestroy, OnInit {
  @Input() baseQueryParams: Partial<ModelQueryParams>;
  @ViewChild(IonInfiniteScroll, {static: true}) infiniteScroll: IonInfiniteScroll;

  private _items: T[] = [];
  get items(): T[] { return this._items; }

  private _hasMore: boolean = true;
  get hasMore(): boolean { return this._hasMore; }

  private _querySub: Subscription = Subscription.EMPTY;
  private _queryParams: Partial<ModelQueryParams> = {start: 0, limit: 20, sort: {}};

  constructor(cdr: ChangeDetectorRef, aui: AdminUserInteractionsService) {
    super(cdr, aui);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._querySub.unsubscribe();
  }

  ngOnInit(): void {
    const service = this._getService();

    if (service == null) { return; }

    this._querySub = service.getListObjects().pipe(
      filter(r => r != null),
    ).subscribe(r => {
      if (this.infiniteScroll) { (this.infiniteScroll as any).complete(); }
      this._items = [...this._items, ...(r!.results || [])];
      this._hasMore = r!.next != null;
      this._cdr.markForCheck();
    });

    this._loadList();
  }

  getSelection(): T[] {
    return [];
  }

  getItems(): T[] {
    return [];
  }

  clearSelection(): void {
  }

  selectAll(): void {
  }

  refreshList(): void {
    this._queryParams.start = 0;
    this._loadList();
  }

  loadMore(): void {
    this._queryParams.start! += this._queryParams.limit!;
    this._loadList();
  }

  private _loadList(): void {
    const service = this._getService();
    if (service == null || !this._hasMore) { return; }
    const queryParams = mergeQueryParams(this._queryParams, this.baseQueryParams);
    service.query(queryParams);
  }
}
