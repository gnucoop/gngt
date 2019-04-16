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

import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';

import {IonInfiniteScroll} from '@ionic/angular';

import {AdminListComponent as BaseAdminListComponent} from '@gngt/core/admin';
import {
  Model, ModelActions, ModelListParams, ModelService, reducers as fromModel
} from '@gngt/core/model';

import {AdminUserInteractionsService} from './admin-user-interactions';

@Component({
  moduleId: module.id,
  selector: 'gngt-admin-list',
  templateUrl: 'list.html',
  styleUrls: ['list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: [
    'title',
    'headers',
    'displayedColumns',
    'baseEditUrl',
    'newItemPath',
    'service'
  ]
})
export class AdminListComponent<
    T extends Model,
    S extends fromModel.State<T>,
    A1 extends ModelActions.ModelGetAction,
    A2 extends ModelActions.ModelListAction,
    A3 extends ModelActions.ModelCreateAction<T>,
    A4 extends ModelActions.ModelUpdateAction<T>,
    A5 extends ModelActions.ModelPatchAction<T>,
    A6 extends ModelActions.ModelDeleteAction<T>,
    A7 extends ModelActions.ModelDeleteAllAction<T>,
    A8 extends ModelActions.ModelQueryAction,
    MS extends ModelService<T, S, A1, A2, A3, A4, A5, A6, A7, A8>
  > extends BaseAdminListComponent<T, S, A1, A2, A3, A4, A5, A6, A7, A8, MS>
    implements OnDestroy, OnInit {
  @Input() baseListParams: ModelListParams;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  private _items: T[] = [];
  get items(): T[] { return this._items; }

  private _hasMore: boolean = true;
  get hasMore(): boolean { return this._hasMore; }

  private _listSub: Subscription = Subscription.EMPTY;
  private _listParams: ModelListParams = {start: 0, limit: 20, sort: {}};

  constructor(cdr: ChangeDetectorRef, aui: AdminUserInteractionsService) {
    super(cdr, aui);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._listSub.unsubscribe();
  }

  ngOnInit(): void {
    const service = this._getService();

    if (service == null) { return; }

    if (this.baseListParams) {
      if (this.baseListParams.start != null) {
        this._listParams.start = this.baseListParams.start;
      }
      if (this.baseListParams.limit != null) {
        this._listParams.limit = this.baseListParams.limit;
      }
    }

    this._listSub = service.getListObjects().pipe(
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
    this._listParams.start = 0;
    this._loadList();
  }

  loadMore(): void {
    this._listParams.start! += this._listParams.limit!;
    this._loadList();
  }

  private _loadList(): void {
    const service = this._getService();
    if (service == null || !this._hasMore) { return; }
    const listParams = {...(this.baseListParams || {}), ...this._listParams};
    service.list(listParams);
  }
}
