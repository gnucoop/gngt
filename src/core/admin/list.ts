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

import {ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy} from '@angular/core';
import {Model} from '@gngt/core/common';
import {ModelActionTypes, ModelService, State as ModelState} from '@gngt/core/model';
import {Observable, of as obsOf, Subscription} from 'rxjs';
import {filter, map, switchMap, take} from 'rxjs/operators';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminListHeader} from './list-header';

@Directive()
export abstract class AdminListComponent<
  T extends Model = Model,
  S extends ModelState<T> = ModelState<T>,
  A extends ModelActionTypes = ModelActionTypes,
  MS extends ModelService<T, S, A> = ModelService<T, S, A>> implements OnDestroy {
  get title(): string { return this._title; }
  @Input() set title(title: string) {
    this._title = title;
    this._cdr.markForCheck();
  }
  private _title: string;

  get headers(): AdminListHeader[] { return this._headers; }
  @Input() set headers(headers: AdminListHeader[]) {
    this._headers = headers;
    this._cdr.markForCheck();
  }
  private _headers: AdminListHeader[] = [];

  get displayedColumns(): string[] { return this._displayedColumns; }
  @Input() set displayedColumns(displayedColumns: string[]) {
    this._displayedColumns = ['select', ...displayedColumns];
    this._cdr.markForCheck();
  }
  private _displayedColumns: string[] = [];

  get baseEditUrl(): string { return this._baseEditUrl; }
  @Input() set baseEditUrl(baseEditUrl: string) {
    this._baseEditUrl = baseEditUrl;
    this._cdr.markForCheck();
  }
  private _baseEditUrl = '';

  get newItemPath(): string { return this._newItemPath; }
  @Input() set newItemPath(newItemPath: string) {
    this._newItemPath = newItemPath;
    this._cdr.markForCheck();
  }
  private _newItemPath = 'new';

  protected _service: MS;
  @Input() set service(service: MS) {
    this._service = service;
    this._initService();
  }

  protected _actionProcessed: EventEmitter<string> = new EventEmitter<string>();
  readonly actionProcessed: Observable<string> = this._actionProcessed.asObservable();

  private _deletionEvt: EventEmitter<T[]> = new EventEmitter<T[]>();
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
    this._deletionEvt.complete();
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
    this._deletionSub.unsubscribe();
    this._deletionSub = this._deletionEvt.pipe(
      switchMap(selected => this._aui.askDeleteConfirm().pipe(
        map(res => ({res, selected})),
      )),
      switchMap(({res, selected}): Observable<T | T[] | null> => {
        if (res) {
          if (selected.length === 1) {
            return this._service.delete(selected[0]);
          }
          return this._service.deleteAll(selected);
        }
        return obsOf(null);
      }),
      filter(r => r != null),
      take(1),
    ).subscribe(() => {
      this._actionProcessed.emit('delete');
      this.clearSelection();
      this.refreshList();
    });
  }
}
