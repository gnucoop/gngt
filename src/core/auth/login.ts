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

import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ChangeDetectorRef, Directive, EventEmitter, Input, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {forceBooleanProp} from '@gngt/core/common';
import {Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';

import * as LoginPageActions from './login-page-actions';
import * as fromAuth from './reducers';

@Directive({selector: '[gngtLoginUsername]'})
export class LoginUsernameDirective {
}

@Directive({selector: '[gngtLoginPassword]'})
export class LoginPasswordDirective {
}

@Directive({selector: '[gngtLoginAction]'})
export class LoginActionDirective {
}

@Directive()
export abstract class LoginComponent implements OnDestroy {
  readonly loginForm: FormGroup;
  readonly valid: Observable<boolean>;

  private _disabled: boolean;
  get disabled(): boolean {
    return this._disabled;
  }
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = forceBooleanProp(disabled);
    this._cdr.markForCheck();
  }

  private _usernamePlaceholder: string;
  @Input()
  get usernamePlaceholder(): string {
    return this._usernamePlaceholder;
  }
  set usernamePlaceholder(usernamePlaceholder: string) {
    this._usernamePlaceholder = usernamePlaceholder;
    this._cdr.markForCheck();
  }

  private _passwordPlaceholder: string;
  @Input()
  get passwordPlaceholder(): string {
    return this._passwordPlaceholder;
  }
  set passwordPlaceholder(passwordPlaceholder: string) {
    this._passwordPlaceholder = passwordPlaceholder;
    this._cdr.markForCheck();
  }

  private _showLabels = true;
  get showLabels(): boolean {
    return this._showLabels;
  }
  @Input()
  set showLabels(showLabels: boolean) {
    this._showLabels = coerceBooleanProperty(showLabels);
    this._cdr.markForCheck();
  }

  private _loginEvt: EventEmitter<void> = new EventEmitter<void>();
  private _loginSub: Subscription = Subscription.EMPTY;

  constructor(fb: FormBuilder, store: Store<fromAuth.State>, protected _cdr: ChangeDetectorRef) {
    this.loginForm = fb.group(
        {username: [null, [Validators.required]], password: [null, [Validators.required]]});

    this.valid = this.loginForm.valueChanges.pipe(map(() => this.loginForm.valid));

    this._loginSub = this._loginEvt.subscribe(() => {
      store.dispatch(new LoginPageActions.Login({credentials: this.loginForm.value}));
    });
  }

  login(): void {
    this._loginEvt.next();
  }

  ngOnDestroy(): void {
    this._loginSub.unsubscribe();
    this._loginEvt.complete();
  }
}
