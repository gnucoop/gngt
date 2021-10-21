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

import {Action} from '@ngrx/store';
import {LoginResponse} from './login-response';

export const enum AuthApiActionTypes {
  LoginSuccess = '[Auth/API] Login Success',
  LoginFailure = '[Auth/API] Login Failure',
  LoginRedirect = '[Auth/API] Login Redirect',
  RefreshToken = '[Auth/API] Refresh token',
}

export class LoginSuccess implements Action {
  readonly type = AuthApiActionTypes.LoginSuccess;

  constructor(public payload: LoginResponse) {}
}

export class LoginFailure implements Action {
  readonly type = AuthApiActionTypes.LoginFailure;

  constructor(public payload: {error: any}) {}
}

export class LoginRedirect implements Action {
  readonly type = AuthApiActionTypes.LoginRedirect;
}

export class RefreshToken implements Action {
  readonly type = AuthApiActionTypes.RefreshToken;

  constructor(public payload: {refreshDelay: number; fromInit?: boolean}) {}
}

export type AuthApiActionsUnion = LoginSuccess | LoginFailure | LoginRedirect | RefreshToken;
