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

import {defer, Observable, of as obsOf, timer, zip} from 'rxjs';
import {catchError, delayWhen, exhaustMap, map, switchMap, tap} from 'rxjs/operators';

import {Actions, Effect, ofType} from '@ngrx/effects';

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
export class AuthEffects {
  @Effect()
  initUser$ = this.actions$.pipe(
    ofType<AuthActions.InitUser>(AuthActions.AuthActionTypes.InitUser),
    exhaustMap(() =>
      this.authService.getCurrentUser().pipe(catchError(_ => obsOf(null)))
    ),
    map((user) => new AuthActions.InitUserComplete({user}))
  );

  @Effect()
  initUserComplete$ = this.actions$.pipe(
    ofType<AuthActions.InitUserComplete>(AuthActions.AuthActionTypes.InitUserComplete),
    map(() => new AuthActions.InitComplete())
  );

  @Effect()
  login$ = this.actions$.pipe(
    ofType<LoginPageActions.Login>(LoginPageActions.LoginPageActionTypes.Login),
    map(action => action.payload.credentials),
    exhaustMap((auth: Credentials) =>
      this.authService.login(auth).pipe(
        map((res) => new AuthApiActions.LoginSuccess(res)),
        catchError((err: HttpErrorResponse) => {
          const errors: string[] = [];
          if (err.status === 0 || !err.error.message) {
            errors.push('Connection problem. Please try again');
          } else {
            errors.push(err.error.message);
          }
          return zip(...errors.map(e => <Observable<string>>this.ts.get(e)))
            .pipe(
              map(error => new AuthApiActions.LoginFailure({error}))
            );
        })
      )
    )
  );

  @Effect()
  loginSuccess$ = this.actions$.pipe(
    ofType<AuthApiActions.LoginSuccess>(AuthApiActions.AuthApiActionTypes.LoginSuccess),
    tap((action) => {
      const payload = <any>action.payload;
      const tokenKey = this.config.tokenKey || 'access_token';
      const refreshTokenKey = this.config.refreshTokenKey || 'refresh_token';
      this.jwtHelperService.tokenSetter(payload[tokenKey]);
      this.jwtHelperService.refreshTokenSetter(payload[refreshTokenKey]);
      if (this.config.loggedInUserSetter) {
        this.config.loggedInUserSetter(payload.user_id);
      }
      this.router.navigate(['/']);
    }),
    map(() => {
      return this._getRefreshTokenAction();
    })
  );

  @Effect({dispatch: false})
  loginFailure$ = this.actions$.pipe(
    ofType<AuthApiActions.LoginFailure>(AuthApiActions.AuthApiActionTypes.LoginFailure),
    tap((action) => {
      this.userInteractionsService.showLoginError(action.payload.error.join('\n'));
    })
  );

  @Effect()
  refreshToken$ = this.actions$.pipe(
    ofType<AuthApiActions.RefreshToken>(AuthApiActions.AuthApiActionTypes.RefreshToken),
    delayWhen((action: AuthApiActions.RefreshToken) => timer(action.payload.refreshDelay)),
    exhaustMap((action: AuthApiActions.RefreshToken) =>
      this.authService.refreshToken(this.jwtHelperService.refreshTokenGetter() || '').pipe(
        switchMap((payload: any) => {
          const res: (AuthApiActions.AuthApiActionsUnion | AuthActions.AuthActionsUnion)[] = [];
          const tokenKey = this.config.tokenKey || 'access_token';
          this.jwtHelperService.tokenSetter(payload[tokenKey]);
          if (action.payload.fromInit) {
            res.push(new AuthActions.InitUser());
          }
          res.push(this._getRefreshTokenAction());
          return res;
        }),
        catchError(() => obsOf(new AuthActions.InitComplete()))
      )
    )
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(
      AuthApiActions.AuthApiActionTypes.LoginRedirect,
      AuthActions.AuthActionTypes.Logout
    ),
    tap(_authed => {
      this.router.navigate(['/login']);
    })
  );

  @Effect()
  logoutConfirmation$ = this.actions$.pipe(
    ofType(AuthActions.AuthActionTypes.LogoutConfirmation),
    exhaustMap(() => this.userInteractionsService.askLogoutConfirm()),
    map(
      result =>
        result
          ? new AuthActions.Logout()
          : new AuthActions.LogoutConfirmationDismiss()
    )
  );

  @Effect()
  init$ = defer(() => obsOf(null)).pipe(
    switchMap(() => {
      const res: (AuthApiActions.AuthApiActionsUnion | AuthActions.AuthActionsUnion)[] = [];
      const token = this.jwtHelperService.tokenGetter();
      if (token) {
        try {
          if (!this.jwtHelperService.isTokenExpired(token)) {
            const decoded = this.jwtHelperService.decodeToken(token);
            const scopes = this.config.disableScopes ? [] : this._getScopesFromToken(decoded);
            if (this.config.disableScopes || scopes.indexOf('admin') > -1) {
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
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private jwtHelperService: JwtHelperService,
    private userInteractionsService: AuthUserInteractionsService,
    private router: Router,
    private ts: TranslateService,
    @Inject(AUTH_OPTIONS) private config: AuthOptions
  ) {}

  private _getRefreshTokenAction(fromInit?: boolean): AuthApiActions.RefreshToken {
    const accessToken = this.jwtHelperService.tokenGetter();
    const exp = this.jwtHelperService.getTokenExpirationDate(accessToken) || new Date();
    const refreshDelay = Math.max(0, Math.round((exp.getTime() - new Date().getTime()) * 0.8));
    return new AuthApiActions.RefreshToken({refreshDelay, fromInit});
  }

  private _getScopesFromToken(token: any): string[] {
    const scopesPath = this.config.scopesPath || ['scopes'];
    scopesPath.forEach(p => token = token[p]);
    return token;
  }
}
