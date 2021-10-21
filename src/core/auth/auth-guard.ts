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
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot,
} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {concatMap, filter, map, take} from 'rxjs/operators';

import * as AuthApiActions from './auth-api-actions';
import * as fromAuth from './reducers';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private _store: Store<fromAuth.State>) {}

  canActivate(): Observable<boolean> {
    return this._guard();
  }

  canActivateChild(_cr: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this._guard();
  }

  private _guard(): Observable<boolean> {
    return this._store.pipe(
      select(fromAuth.getInit),
      filter(init => init),
      concatMap(() => this._store.pipe(select(fromAuth.getLoggedIn))),
      map(authed => {
        if (!authed) {
          this._store.dispatch(new AuthApiActions.LoginRedirect());
          return false;
        }

        return true;
      }),
      take(1),
    );
  }
}
