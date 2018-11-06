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

import {HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {AuthOptions} from './auth-options';
import {AUTH_OPTIONS} from './auth-options-token';
import {Credentials} from './credentials';
import {LoginResponse} from './login-response';
import {RefreshTokenResponse} from './refresh-token-response';
import {User} from './user';


@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private _http: HttpClient, @Inject(AUTH_OPTIONS) private _config: AuthOptions) {}

  login(credentials: Credentials): Observable<LoginResponse> {
    const url = this._config.loginUrl;
    return this._http.post<LoginResponse>(url, credentials);
  }

  logout() {
    const url = this._config.logoutUrl;
    return this._http.post<null>(url, {});
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    const url = this._config.refreshTokenUrl;
    return this._http.post<RefreshTokenResponse>(url, {refresh_token: refreshToken});
  }

  getCurrentUser(): Observable<User> {
    const url = this._config.meUrl;
    return this._http.get<User>(url);
  }
}
