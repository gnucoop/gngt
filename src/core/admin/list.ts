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

import {ChangeDetectorRef, EventEmitter, OnDestroy} from '@angular/core';

import {merge, Observable, Subscription} from 'rxjs';

import {Model, ModelActions, ModelService, reducers as fromModel} from '@gngt/core/model';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminListHeader} from './list-header';


export abstract class AdminListComponent<
  T extends Model,
  S extends fromModel.State<T>,
  A1 extends ModelActions.ModelGetAction,
  A2 extends ModelActions.ModelListAction,
  A3 extends ModelActions.ModelCreateAction<T>,
  A4 extends ModelActions.ModelUpdateAction<T>,
  A5 extends ModelActions.ModelPatchAction<T>,
  A6 extends ModelActions.ModelDeleteAction<T>,
  A7 extends ModelActions.ModelDeleteAllAction<T>,
  MS extends ModelService<T, S, A1, A2, A3, A4, A5, A6, A7>> implements OnDestroy {
  get title(): string { return this._title; }
  set title(title: string) {
    this._title = title;
    this._cdr.markForCheck();
  }
  private _title: string;

  get headers(): AdminListHeader[] { return this._headers; }
  set headers(headers: AdminListHeader[]) {
    this._headers = headers;
    this._cdr.markForCheck();
  }
  private _headers: AdminListHeader[] = [];

  get displayedColumns(): string[] { return this._displayedColumns; }
  set displayedColumns(displayedColumns: string[]) {
    this._displayedColumns = ['select', ...displayedColumns];
    this._cdr.markForCheck();
  }
  private _displayedColumns: string[] = [];

  get baseEditUrl(): string { return this._baseEditUrl; }
  set baseEditUrl(baseEditUrl: string) {
    this._baseEditUrl = baseEditUrl;
    this._cdr.markForCheck();
  }
  private _baseEditUrl = '';

  get newItemPath(): string { return this._newItemPath; }
  set newItemPath(newItemPath: string) {
    this._newItemPath = newItemPath;
    this._cdr.markForCheck();
  }
  private _newItemPath = 'new';

  private _service: MS;
  set service(service: MS) {
    this._service = service;
    this._initService();
  }

  private _actionProcessed: EventEmitter<string> = new EventEmitter<string>();
  readonly actionProcessed: Observable<string> = this._actionProcessed.asObservable();

  private _deletionSub: Subscription = Subscription.EMPTY;

  constructor(protected _cdr: ChangeDetectorRef, private _aui: AdminUserInteractionsService) { }

  abstract getSelection(): T[];
  abstract getItems(): T[];
  abstract clearSelection(): void;
  abstract selectAll(): void;
  abstract refreshList(): void;

  isAllSelected() {
    const numSelected = this.getSelection().length;
    const numRows = this.getItems().length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ? this.clearSelection() : this.selectAll();
  }

  ngOnDestroy(): void {
    this._deletionSub.unsubscribe();
  }

  processAction(action: string): void {
    const selected = this.getSelection();
    if (!selected || selected.length === 0) {
      return;
    }
    const handlerName = this._getActionHandler(action);
    const handler: (s: T[]) => void = (this as any)[handlerName];
    if (handler != null) {
      handler.call(this, selected);
    }
  }

  processDeleteAction(selected: T[]): void {
    if (this._service == null) { return; }
    const s = this._aui.askDeleteConfirm().subscribe(res => {
      if (s) { s.unsubscribe(); }
      if (res) {
        if (selected.length === 1) {
          this._service.delete(selected[0]);
        } else {
          this._service.deleteAll(selected);
        }

        this._actionProcessed.emit('delete');
        this.clearSelection();
      }
    });
  }

  protected _getService(): MS { return this._service; }

  private _getActionHandler(action: string): string {
    action = action.charAt(0).toUpperCase() + action.substring(1);
    return `process${action}Action`;
  }

  private _initService(): void {
    this._deletionSub = merge(
      this._service.getDeleteSuccess(), this._service.getDeleteAllSuccess()
    ).subscribe(() => this.refreshList());
  }
}
