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
  AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
  ContentChildren, Input, OnDestroy, OnInit, QueryList, TemplateRef,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatPaginator} from '@angular/material/paginator';
import {MatSelect} from '@angular/material/select';
import {MatSort} from '@angular/material/sort';

import {AdminListComponent as BaseAdminListComponent} from '@gngt/core/admin';
import {Model, ModelActions, ModelService, reducers as fromModel} from '@gngt/core/model';
import {ModelDataSource} from '@gngt/material/model';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminListCellDirective} from './list-cell';

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
    A extends ModelActions.ModelActionTypes,
    MS extends ModelService<T, S, A>
  > extends BaseAdminListComponent<T, S, A, MS>
    implements AfterContentInit, OnDestroy, OnInit {
  private _dataSource: ModelDataSource<T, S, A, MS>;
  get dataSource(): ModelDataSource<T, S, A, MS> { return this._dataSource; }
  @Input() set dataSource(dataSource: ModelDataSource<T, S, A, MS>) {
    if (dataSource !== this.dataSource) {
      this._dataSource = dataSource;
      this._fillDataSource();
    }
  }
  @ViewChild(MatPaginator, {static: true}) paginatorCmp: MatPaginator;
  @ViewChild(MatSort, {static: true}) sortCmp: MatSort;
  @ViewChild('actionSel', {static: true, read: MatSelect}) actionSel: MatSelect;
  @ContentChildren(AdminListCellDirective) cellTemplates: QueryList<AdminListCellDirective>;
  readonly selection: SelectionModel<T> = new SelectionModel<T>(true, []);

  private _cellTemplatesMap: {[column: string]: TemplateRef<any>} = {};
  get cellTemplatesMap(): {[column: string]: TemplateRef<any>} { return this._cellTemplatesMap; }

  constructor(cdr: ChangeDetectorRef, aui: AdminUserInteractionsService) {
    super(cdr, aui);
  }

  ngAfterContentInit(): void {
    this._cellTemplatesMap = this.cellTemplates.reduce((prev, cur) => {
      prev[cur.column] = cur.templateRef;
      return prev;
    }, {} as {[column: string]: TemplateRef<any>});
  }

  ngOnInit(): void {
    this._fillDataSource();
  }

  getSelection(): T[] {
    return this.selection ? this.selection.selected : [];
  }

  getItems(): T[] {
    return this.dataSource ? this.dataSource.data : [];
  }

  clearSelection(): void {
    if (this.selection == null) { return; }
    this.selection.clear();
  }

  selectAll(): void {
    if (this.dataSource == null) { return; }
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  refreshList(): void {
    if (this.dataSource == null) { return; }
    this.dataSource.refresh();
  }

  private _fillDataSource(): void {
    if (this.dataSource == null) { return; }
    this.dataSource.paginator = this.paginatorCmp;
    this.dataSource.sort = this.sortCmp;
  }
}
