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

import {ChangeDetectorRef, EventEmitter, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject, combineLatest, Observable, of as obsOf, merge, Subscription} from 'rxjs';
import {filter, map, shareReplay, switchMap, withLatestFrom} from 'rxjs/operators';

import {AdminEditField} from './edit-field';
import {Model, ModelActions, ModelService, reducers as fromModel} from '@gngt/core/model';

export abstract class AdminEditComponent<
  T extends Model,
  S extends fromModel.State<T>,
  A1 extends ModelActions.ModelGetAction,
  A2 extends ModelActions.ModelListAction,
  A3 extends ModelActions.ModelCreateAction<T>,
  A4 extends ModelActions.ModelUpdateAction<T>,
  A5 extends ModelActions.ModelPatchAction<T>,
  A6 extends ModelActions.ModelDeleteAction<T>,
  A7 extends ModelActions.ModelDeleteAllAction<T>> implements OnDestroy {
  private _title = '';
  get title(): string {return this._title; }
  @Input() set title(title: string) {
    this._title = title;
    this._cdr.markForCheck();
  }

  private _listUrl: string;
  @Input() set listUrl(listUrl: string) { this._listUrl = listUrl; }

  private _cancelLabel = 'Cancel';
  get cancelLabel(): string {return this._cancelLabel; }
  @Input() set cancelLabel(cancelLabel: string) {
    this._cancelLabel = cancelLabel;
    this._cdr.markForCheck();
  }

  private _saveLabel = 'Save';
  get saveLabel(): string {return this._saveLabel; }
  @Input() set saveLabel(saveLabel: string) {
    this._saveLabel = saveLabel;
    this._cdr.markForCheck();
  }

  private _service: BehaviorSubject<ModelService<T, S, A1, A2, A3, A4, A5, A6, A7> | null> =
    new BehaviorSubject<ModelService<T, S, A1, A2, A3, A4, A5, A6, A7> | null>(null);
  @Input() set service(service: ModelService<T, S, A1, A2, A3, A4, A5, A6, A7>) {
    this._service.next(service);
  }

  private _fields: AdminEditField[] = [];
  get fields(): AdminEditField[] {return this._fields; }
  @Input() set fields(fields: AdminEditField[]) {
    this._fields = fields;
    this._updateForm();
  }

  private _id: BehaviorSubject<number | 'new' | null> =
    new BehaviorSubject<number | 'new' | null>(null);
  @Input() set id(id: number | 'new') {
    this._id.next(id);
  }

  private _processFormData: (value: any) => void;
  @Input() set processFormData(func: (value: any) => void) {
    this._processFormData = func;
  }

  readonly form: Observable<FormGroup>;
  readonly loading: Observable<boolean>;

  private _updateFormEvt: EventEmitter<void> = new EventEmitter<void>();
  private _saveEvt: EventEmitter<void> = new EventEmitter<void>();

  private _saveSub: Subscription = Subscription.EMPTY;
  private _savedSub: Subscription = Subscription.EMPTY;

  constructor(
    private _cdr: ChangeDetectorRef, private _fb: FormBuilder,
    private _router: Router
  ) {
    this._processFormData = this._defaultProcessData;

    const objObs = combineLatest(this._service, this._id).pipe(
      filter(([ s, i ]) => s != null && i != null),
      switchMap(([ s, i ]) => {
        if (i === 'new') {return obsOf({}); }
        s!.get(i!);
        return s!.getGetObject();
      }),
      filter(o => o != null),
      shareReplay(1)
    );

    this.form = combineLatest(objObs, this._updateFormEvt).pipe(
      map(r => {
        const model = r[ 0 ];
        return this._fb.group(
          (this._fields || []).reduce((prev, cur) => {
            let val: any = model ? (model as any)[ cur.name ] : null;
            // if field is an object with id reassign val with id;
            val = val && val.id ? val.id : val;
            (prev as any)[ cur.name ] = [ val, cur.validators ];
            return prev;
          }, {}));
      }),
      shareReplay(1)
    );

    this._saveSub = this._saveEvt.pipe(
      withLatestFrom(this.form, this._service, this._id),
      filter(r => r[ 2 ] != null),
    ).subscribe(([ _, form, service, id ]) => {
      if (form == null || service == null && !form.valid) {return; }
      const formValue = {...form.value};
      this._processFormData(formValue);
      if (id === 'new') {
        delete formValue[ 'id' ];
        service!.create(formValue);
      } else {
        service!.patch(formValue);
      }
    });

    const serviceObs = this._service.pipe(filter(s => s != null));
    this.loading = serviceObs.pipe(
      filter(s => s != null),
      switchMap(s => merge(s!.getGetLoading(), s!.getCreateLoading(), s!.getPatchLoading()))
    );

    this._savedSub = serviceObs.pipe(
      filter(s => s != null),
      switchMap(s => merge(s!.getCreateSuccess(), s!.getPatchSuccess()))
    ).subscribe(() => this.goBack());
  }

  goBack(): void {
    this._router.navigate([ this._listUrl ]);
  }

  save(): void {
    this._saveEvt.emit();
  }

  ngOnDestroy(): void {
    this._saveSub.unsubscribe();
    this._savedSub.unsubscribe();
  }

  private _defaultProcessData(value: any): void {
    this._fields.forEach((field: AdminEditField) => {
      if (field.subtype) {
        switch (field.subtype) {
          default:
            break;
          case 'number':
            if (value[ field.name ] != null) {
              if (value[ field.name ].includes('.')) {
                value[ field.name ] = parseFloat(value[ field.name ]);
              } else {
                value[ field.name ] = parseInt(value[ field.name ]);
              }
            }
            break;
        }
      }
    });
  }

  private _updateForm(): void {
    this._updateFormEvt.emit();
  }
}
