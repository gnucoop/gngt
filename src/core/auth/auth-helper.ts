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

import {Injectable} from '@angular/core';
import {Actions, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {Observable, of as obsOf} from 'rxjs';
import {map} from 'rxjs/operators';

import {
  AuthActionsUnion,
  AuthActionTypes,
  Logout,
  LogoutConfirmation,
} from './auth-actions';
import {State} from './auth-reducer';

@Injectable({providedIn: 'root'})
export class AuthHelper {
  constructor(
      private _store: Store<State>,
      private _actions: Actions,
  ) {}

  logout(requestConfirmation = true): Observable<boolean> {
    if (!requestConfirmation) {
      this._store.dispatch(new Logout());
      return obsOf(true);
    }
    this._store.dispatch(new LogoutConfirmation());
    return this._actions.pipe(
        ofType<AuthActionsUnion>(
            AuthActionTypes.Logout,
            AuthActionTypes.LogoutConfirmationDismiss,
            ),
        map(action => action.type === AuthActionTypes.Logout),
    );
  }
}
