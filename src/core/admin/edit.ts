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

import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ChangeDetectorRef, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

import {BehaviorSubject, combineLatest, Observable, of as obsOf, Subscription} from 'rxjs';
import {
  filter, map, mapTo, shareReplay, switchMap, take, tap, withLatestFrom
} from 'rxjs/operators';

import {Model, ModelActions, ModelService, reducers as fromModel} from '@gngt/core/model';
import {AdminEditField} from './edit-field';
import {ProcessDataFn} from './process-data-fn';

export abstract class AdminEditComponent<
  T extends Model,
  S extends fromModel.State<T>,
  A extends ModelActions.ModelActionTypes> implements OnDestroy {
  private _title = '';
  get title(): string { return this._title; }
  @Input() set title(title: string) {
    this._title = title;
    this._cdr.markForCheck();
  }

  private _listUrl: string;
  @Input() set listUrl(listUrl: string) { this._listUrl = listUrl; }

  private _cancelLabel = 'Cancel';
  get cancelLabel(): string { return this._cancelLabel; }
  @Input() set cancelLabel(cancelLabel: string) {
    this._cancelLabel = cancelLabel;
    this._cdr.markForCheck();
  }

  private _saveLabel = 'Save';
  get saveLabel(): string { return this._saveLabel; }
  @Input() set saveLabel(saveLabel: string) {
    this._saveLabel = saveLabel;
    this._cdr.markForCheck();
  }

  private _service: BehaviorSubject<ModelService<T, S, A> | null> =
    new BehaviorSubject<ModelService<T, S, A> | null>(null);
  @Input() set service(service: ModelService<T, S, A>) {
    this._service.next(service);
  }

  private _fields: AdminEditField[] = [];
  get fields(): AdminEditField[] { return this._fields; }
  @Input() set fields(fields: AdminEditField[]) {
    this._fields = fields;
    this._updateForm();
  }

  private _id: BehaviorSubject<number | 'new' | null> =
    new BehaviorSubject<number | 'new' | null>(null);
  @Input() set id(id: number | 'new') {
    this._id.next(id);
  }

  private _processObject: ProcessDataFn | Observable<ProcessDataFn>;
  @Input()
  set processObject(processObject: ProcessDataFn | Observable<ProcessDataFn>) {
    this._processObject = processObject;
  }

  private _processFormData: ProcessDataFn | Observable<ProcessDataFn>;
  @Input()
  set processFormData(
    processFormData: ProcessDataFn | Observable<ProcessDataFn>) {
    this._processFormData = processFormData;
  }

  private _readonly: boolean;
  get readonly(): boolean { return this._readonly; }
  @Input()
  set readonly(readonly: boolean) {
    readonly = coerceBooleanProperty(readonly);
    if (readonly !== this._readonly) {
      this._readonly = readonly;
      this._cdr.markForCheck();
    }
  }

  private _hideSaveButton: boolean;
  get hideSaveButton(): boolean { return this._hideSaveButton; }
  @Input()
  set hideSaveButton(hideSaveButton: boolean) {
    hideSaveButton = coerceBooleanProperty(hideSaveButton);
    if (hideSaveButton !== this._hideSaveButton) {
      this._hideSaveButton = hideSaveButton;
      this._cdr.markForCheck();
    }
  }

  private _canSave: boolean;
  get canSave(): boolean { return this._canSave; }
  @Input()
  set canSave(canSave: boolean) {
    canSave = coerceBooleanProperty(canSave);
    if (canSave !== this._canSave) {
      this._canSave = canSave;
      this._cdr.markForCheck();
    }
  }

  private _postSaveHook: (obj: T) => Observable<T>;
  @Input()
  set postSaveHook(postSaveHook: (obj: T) => Observable<T>) {
    this._postSaveHook = postSaveHook;
  }

  readonly form: Observable<FormGroup>;

  private _loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  readonly loading: Observable<boolean> = this._loading.asObservable();

  private _updateFormEvt: EventEmitter<void> = new EventEmitter<void>();
  private _saveEvt: EventEmitter<void> = new EventEmitter<void>();

  private _saveSub: Subscription = Subscription.EMPTY;

  private _valueChanges$: Observable<any>;

  @Output()
  get valueChanges$(): Observable<any>  {
  return this._valueChanges$;
  }

  constructor(
    private _cdr: ChangeDetectorRef, private _fb: FormBuilder,
    private _router: Router
  ) {
    this._processFormData = this._defaultProcessData;

    const objObs = combineLatest(this._service, this._id).pipe(
      filter(([s, i]) => s != null && i != null),
      switchMap(([s, i]) => {
        if (i === 'new') { return obsOf({}); }
        s!.get(i!);
        return s!.getGetObject();
      }),
      filter(o => o != null),
      switchMap(o => {
        if (this._processObject) {
          if (this._processObject instanceof Observable) {
            return this._processObject.pipe(
              tap(po => po(o)),
              mapTo(o),
            );
          } else {
            this._processObject(o);
          }
        }
        return obsOf(o);
      }),
      shareReplay(1)
    );

    this.form = combineLatest(objObs, this._updateFormEvt).pipe(
      map(r => {
        const model = r[0];
        return this._fb.group(
          (this._fields || []).reduce((prev, cur) => {
            const val = model ? (model as any)[cur.name] : null;
            (prev as any)[cur.name] = [val, cur.validators];
            return prev;
        }, {}));
      }),
      shareReplay(1)
    );

    this._valueChanges$ = this.form.pipe(
      switchMap((form) => form.valueChanges)
    );

    const serviceObs = this._service.pipe(filter(s => s != null));

    this._saveSub = this._saveEvt.pipe(
      withLatestFrom(this.form, serviceObs, this._id),
      filter(([_, form, service, __]) => form != null && service != null && form.valid),
      switchMap(([_, form, service, id]) => {
        const formValue = {...form.value};
        this._defaultProcessData(formValue);
        if (this._processFormData) {
          if (this._processFormData instanceof Observable) {
            return this._processFormData.pipe(
              tap(pd => pd(formValue)),
              mapTo([formValue, service, id] as [any, ModelService<T, S, A>, number|'new']),
            );
          } else {
            this._processFormData(formValue);
          }
        }
        return obsOf([formValue, service, id] as [any, ModelService<T, S, A>, number|'new']);
      }),
      tap<[any, ModelService<T, S, A>, number|'new']>(() => this._loading.next(true)),
      switchMap(([formValue, service, id]: [any, ModelService<T, S, A>, number|'new']) => {
        if (id === 'new') {
          delete formValue['id'];
          return service!.create(formValue);
        }
        return service!.patch(formValue);
      }),
      take(1),
      switchMap((r: T) => {
        if (this._postSaveHook == null) {
          return obsOf(r);
        }
        return this._postSaveHook(r);
      }),
    ).subscribe(
      () => {
        this._loading.next(false);
        this.goBack();
      },
      () => this._loading.next(false),
    );
  }

  goBack(): void {
    this._router.navigate([this._listUrl]);
  }

  save(): void {
    this._saveEvt.emit();
  }

  ngOnDestroy(): void {
    this._updateFormEvt.complete();
    this._saveEvt.complete();
    this._saveSub.unsubscribe();
  }

  private _defaultProcessData(value: any): void {
    this._fields.forEach((field: AdminEditField) => {
      if (field.subtype) {
        switch (field.subtype) {
          case 'number':
            if (value[field.name] != null && typeof value[field.name] === 'string') {
              if (value[field.name].includes('.')) {
                value[field.name] = parseFloat(value[field.name]);
              } else {
                value[field.name] = parseInt(value[field.name]);
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
