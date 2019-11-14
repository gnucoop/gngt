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

import {HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';

import {Observable, of as obsOf, timer, zip} from 'rxjs';
import {catchError, delayWhen, exhaustMap, map, mergeMap, switchMap, tap} from 'rxjs/operators';

import {Actions, createEffect, ofType, OnInitEffects} from '@ngrx/effects';

import {TranslateService} from '@ngx-translate/core';

import {AuthService} from './auth';
import * as AuthActions from './auth-actions';
import * as AuthApiActions from './auth-api-actions';
import {AuthOptions} from './auth-options';
import {AUTH_OPTIONS} from './auth-options-token';
import {AuthUserInteractionsService} from './auth-user-interactions';
import {JwtHelperService} from './jwt-helper';
import * as LoginPageActions from './login-page-actions';
import {Credentials} from './credentials';


@Injectable()
export class AuthEffects implements OnInitEffects {
  initUser$ = createEffect(() => this._actions$.pipe(
    ofType<AuthActions.InitUser>(AuthActions.AuthActionTypes.InitUser),
    exhaustMap(() =>
      this._authService.getCurrentUser().pipe(catchError(_ => {
        return obsOf(this._config.meGetter != null ? this._config.meGetter() : null);
      }))
    ),
    map((user) => {
      if (this._config.meSetter != null) {
        this._config.meSetter(user);
      }
      return new AuthActions.InitUserComplete({user});
    }),
  ));

  initUserComplete$ = createEffect(() => this._actions$.pipe(
    ofType<AuthActions.InitUserComplete>(AuthActions.AuthActionTypes.InitUserComplete),
    map(() => new AuthActions.InitComplete())
  ));

  login$ = createEffect(() => this._actions$.pipe(
    ofType<LoginPageActions.Login>(LoginPageActions.LoginPageActionTypes.Login),
    map(action => action.payload.credentials),
    exhaustMap((auth: Credentials) =>
      this._authService.login(auth).pipe(
        map((res) => new AuthApiActions.LoginSuccess(res)),
        catchError((err: HttpErrorResponse) => {
          const errors: string[] = [];
          if (err.status === 0 || !err.error.message) {
            errors.push('Connection problem. Please try again');
          } else {
            errors.push(err.error.message);
          }
          return zip(...errors.map(e => <Observable<string>>this._ts.get(e)))
            .pipe(
              map(error => new AuthApiActions.LoginFailure({error}))
            );
        })
      )
    )
  ));

  loginSuccess$ = createEffect(() => this._actions$.pipe(
    ofType<AuthApiActions.LoginSuccess>(AuthApiActions.AuthApiActionTypes.LoginSuccess),
    tap((action) => {
      const payload = <any>action.payload;
      const tokenKey = this._config.tokenKey || 'access_token';
      const refreshTokenKey = this._config.refreshTokenKey || 'refresh_token';
      this._jwtHelperService.tokenSetter(payload[tokenKey]);
      this._jwtHelperService.refreshTokenSetter(payload[refreshTokenKey]);
      if (this._config.loggedInUserSetter) {
        this._config.loggedInUserSetter(payload.user_id);
      }
      this._router.navigate(['/']);
    }),
    mergeMap((action) => [
      this._getRefreshTokenAction(),
      new AuthActions.InitUserComplete({user: action.payload.user}),
    ]),
  ));

  loginFailure$ = createEffect(() => this._actions$.pipe(
    ofType<AuthApiActions.LoginFailure>(AuthApiActions.AuthApiActionTypes.LoginFailure),
    tap((action) => {
      this._userInteractionsService.showLoginError(action.payload.error.join('\n'));
    }),
  ), {dispatch: false});

  refreshToken$ = createEffect(() => this._actions$.pipe(
    ofType<AuthApiActions.RefreshToken>(AuthApiActions.AuthApiActionTypes.RefreshToken),
    delayWhen((action: AuthApiActions.RefreshToken) => timer(action.payload.refreshDelay)),
    exhaustMap((action: AuthApiActions.RefreshToken) =>
      this._authService.refreshToken(this._jwtHelperService.refreshTokenGetter() || '').pipe(
        switchMap((payload: any) => {
          const res: (AuthApiActions.AuthApiActionsUnion | AuthActions.AuthActionsUnion)[] = [];
          const tokenKey = this._config.tokenKey || 'access_token';
          this._jwtHelperService.tokenSetter(payload[tokenKey]);
          if (action.payload.fromInit) {
            res.push(new AuthActions.InitUser());
          }
          res.push(this._getRefreshTokenAction());
          return res;
        }),
        catchError(err => {
          if (err.status === 0) {
            return obsOf(new AuthActions.InitUser());
          }
          return obsOf(new AuthActions.InitComplete());
        }),
      )
    )
  ));

  loginRedirect$ = createEffect(() => this._actions$.pipe(
    ofType(
      AuthApiActions.AuthApiActionTypes.LoginRedirect,
      AuthActions.AuthActionTypes.Logout
    ),
    tap(_authed => {
      this._router.navigate(['/login']);
    })
  ), {dispatch: false});

  logoutConfirmation$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.AuthActionTypes.LogoutConfirmation),
    exhaustMap(() => this._userInteractionsService.askLogoutConfirm()),
    map(
      result =>
        result
          ? new AuthActions.Logout()
          : new AuthActions.LogoutConfirmationDismiss()
    )
  ));

  init$ = createEffect(() => this._actions$.pipe(
    ofType(AuthActions.AuthActionTypes.Init),
    switchMap(() => {
      const res: (AuthApiActions.AuthApiActionsUnion | AuthActions.AuthActionsUnion)[] = [];
      const token = this._jwtHelperService.tokenGetter();
      if (token) {
        try {
          if (!this._jwtHelperService.isTokenExpired(token)) {
            const decoded = this._jwtHelperService.decodeToken(token);
            const scopes = this._config.disableScopes ? [] : this._getScopesFromToken(decoded);
            if (this._config.disableScopes || scopes.indexOf('admin') > -1) {
              res.push(new AuthActions.InitUser());
              res.push(this._getRefreshTokenAction());
            }
          } else {
            res.push(new AuthApiActions.RefreshToken({refreshDelay: 0, fromInit: true}));
          }
        } catch (e) {
          res.push(new AuthActions.InitComplete());
        }
      } else {
        res.push(new AuthActions.InitComplete());
      }
      return res;
    })
  ));

  constructor(
    private _actions$: Actions,
    private _authService: AuthService,
    private _jwtHelperService: JwtHelperService,
    private _userInteractionsService: AuthUserInteractionsService,
    private _router: Router,
    private _ts: TranslateService,
    @Inject(AUTH_OPTIONS) private _config: AuthOptions
  ) {}

  ngrxOnInitEffects(): AuthActions.Init {
    return new AuthActions.Init();
  }

  private _getRefreshTokenAction(fromInit?: boolean): AuthApiActions.RefreshToken {
    const accessToken = this._jwtHelperService.tokenGetter();
    const exp = this._jwtHelperService.getTokenExpirationDate(accessToken) || new Date();
    const refreshDelay = Math.max(0, Math.round((exp.getTime() - new Date().getTime()) * 0.8));
    return new AuthApiActions.RefreshToken({refreshDelay, fromInit});
  }

  private _getScopesFromToken(token: any): string[] {
    const scopesPath = this._config.scopesPath || ['scopes'];
    scopesPath.forEach(p => token = token[p]);
    return token;
  }
}
