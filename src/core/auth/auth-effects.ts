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

import {HttpErrorResponse} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Actions, createEffect, ofType, OnInitEffects} from '@ngrx/effects';
import {TranslateService} from '@ngx-translate/core';
import {Observable, of as obsOf, timer, zip} from 'rxjs';
import {catchError, delayWhen, exhaustMap, map, mergeMap, switchMap, tap} from 'rxjs/operators';

import {AuthService} from './auth';
import {
  AuthActionsUnion,
  AuthActionTypes,
  Init,
  InitComplete,
  InitUser,
  InitUserComplete,
  Logout,
  LogoutConfirmationDismiss,
} from './auth-actions';
import {
  AuthApiActionsUnion,
  AuthApiActionTypes,
  LoginFailure,
  LoginSuccess,
  RefreshToken,
} from './auth-api-actions';
import {AuthOptions} from './auth-options';
import {AUTH_OPTIONS} from './auth-options-token';
import {AuthUserInteractionsService} from './auth-user-interactions';
import {Credentials} from './credentials';
import {JwtHelperService} from './jwt-helper';
import * as LoginPageActions from './login-page-actions';
import {User} from './user';

export type AllAuthActions = AuthActionsUnion | AuthApiActionsUnion;

@Injectable()
export class AuthEffects implements OnInitEffects {
  initUser$: Observable<AuthActionsUnion> = createEffect(() =>
    this._actions$.pipe(
      ofType<InitUser>(AuthActionTypes.InitUser),
      exhaustMap(() =>
        this._authService.getCurrentUser().pipe(
          catchError(_ => {
            return obsOf(this._config.meGetter != null ? this._config.meGetter() : null);
          }),
        ),
      ),
      map(u => {
        const user = u as User | null;
        if (this._config.meSetter != null) {
          this._config.meSetter(user);
        }
        return new InitUserComplete({user});
      }),
    ),
  );

  initUserComplete$: Observable<AuthActionsUnion> = createEffect(() =>
    this._actions$.pipe(
      ofType<InitUserComplete>(AuthActionTypes.InitUserComplete),
      map(() => new InitComplete()),
    ),
  );

  login$: Observable<AuthApiActionsUnion> = createEffect(
    () =>
      this._actions$.pipe(
        ofType<LoginPageActions.Login>(LoginPageActions.LoginPageActionTypes.Login),
        map(action => action.payload.credentials),
        exhaustMap((auth: Credentials) =>
          this._authService.login(auth).pipe(
            map(res => new LoginSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errors: string[] = [];
              if (err.status === 0 || !err.error.message) {
                errors.push('Connection problem. Please try again');
              } else {
                errors.push(err.error.message);
              }
              return zip(...errors.map(e => <Observable<string>>this._ts.get(e))).pipe(
                map(error => new LoginFailure({error})),
              );
            }),
          ),
        ),
      ) as Observable<AuthApiActionsUnion>,
  );

  loginSuccess$: Observable<AllAuthActions> = createEffect(
    () =>
      this._actions$.pipe(
        ofType<LoginSuccess>(AuthApiActionTypes.LoginSuccess),
        tap(action => {
          const payload = <any>action.payload;
          const tokenKey = this._config.tokenKey || 'access_token';
          const refreshTokenKey = this._config.refreshTokenKey || 'refresh_token';
          this._jwtHelperService.tokenSetter(payload[tokenKey]);
          this._jwtHelperService.refreshTokenSetter(payload[refreshTokenKey]);
          if (this._config.loggedInUserSetter) {
            this._config.loggedInUserSetter(payload.user_id);
          }
          if (this._config.meSetter != null) {
            this._config.meSetter(payload.user);
          }
          this._router.navigate(['/']);
        }),
        mergeMap(action => [
          this._getRefreshTokenAction(),
          new InitUserComplete({user: action.payload.user}),
        ]),
      ) as Observable<AllAuthActions>,
  );

  loginFailure$: Observable<AuthApiActionsUnion> = createEffect(
    () =>
      this._actions$.pipe(
        ofType<LoginFailure>(AuthApiActionTypes.LoginFailure),
        tap(action => {
          this._userInteractionsService.showLoginError(action.payload.error.join('\n'));
        }),
      ),
    {dispatch: false},
  );

  refreshToken$: Observable<AllAuthActions> = createEffect(
    () =>
      this._actions$.pipe(
        ofType<RefreshToken>(AuthApiActionTypes.RefreshToken),
        delayWhen((action: RefreshToken) => timer(action.payload.refreshDelay)),
        exhaustMap((action: RefreshToken) =>
          this._authService.refreshToken(this._jwtHelperService.refreshTokenGetter() || '').pipe(
            switchMap((payload: any) => {
              const res: (AuthApiActionsUnion | AuthActionsUnion)[] = [];
              const tokenKey = this._config.tokenKey || 'access_token';
              this._jwtHelperService.tokenSetter(payload[tokenKey]);
              if (action.payload.fromInit) {
                res.push(new InitUser());
              }
              res.push(this._getRefreshTokenAction());
              return res;
            }),
            catchError(err => {
              if (err.status === 0) {
                return obsOf(new InitUser());
              }
              return obsOf(new InitComplete());
            }),
          ),
        ),
      ) as Observable<AllAuthActions>,
  );

  loginRedirect$: Observable<AllAuthActions> = createEffect(
    () =>
      this._actions$.pipe(
        ofType(AuthApiActionTypes.LoginRedirect, AuthActionTypes.Logout),
        tap(_authed => {
          this._router.navigate(['/login']);
        }),
      ),
    {dispatch: false},
  );

  logoutConfirmation$: Observable<AuthActionsUnion> = createEffect(() =>
    this._actions$.pipe(
      ofType(AuthActionTypes.LogoutConfirmation),
      exhaustMap(() => this._userInteractionsService.askLogoutConfirm()),
      map(result => (result ? new Logout() : new LogoutConfirmationDismiss())),
    ),
  );

  logout$: Observable<AuthActionsUnion> = createEffect(
    () =>
      this._actions$.pipe(
        ofType(AuthActionTypes.Logout),
        tap(() => {
          this._jwtHelperService.tokenSetter(null);
          this._jwtHelperService.refreshTokenSetter(null);
          if (this._config.loggedInUserSetter != null) {
            this._config.loggedInUserSetter(null);
          }
          if (this._config.meSetter != null) {
            this._config.meSetter(null);
          }
        }),
      ),
    {dispatch: false},
  );

  init$: Observable<AllAuthActions> = createEffect(
    () =>
      this._actions$.pipe(
        ofType(AuthActionTypes.Init),
        switchMap(() => {
          const res: (AuthApiActionsUnion | AuthActionsUnion)[] = [];
          const token = this._jwtHelperService.tokenGetter();
          if (token) {
            try {
              if (!this._jwtHelperService.isTokenExpired(token)) {
                const decoded = this._jwtHelperService.decodeToken(token);
                const scopes = this._config.disableScopes ? [] : this._getScopesFromToken(decoded);
                if (this._config.disableScopes || scopes.indexOf('admin') > -1) {
                  res.push(new InitUser());
                  res.push(this._getRefreshTokenAction());
                }
              } else {
                res.push(new RefreshToken({refreshDelay: 0, fromInit: true}));
              }
            } catch (e) {
              res.push(new InitComplete());
            }
          } else {
            res.push(new InitComplete());
          }
          return res;
        }),
      ) as Observable<AllAuthActions>,
  );

  constructor(
    private _actions$: Actions,
    private _authService: AuthService,
    private _jwtHelperService: JwtHelperService,
    private _userInteractionsService: AuthUserInteractionsService,
    private _router: Router,
    private _ts: TranslateService,
    @Inject(AUTH_OPTIONS) private _config: AuthOptions,
  ) {}

  ngrxOnInitEffects(): Init {
    return new Init();
  }

  private _getRefreshTokenAction(fromInit?: boolean): RefreshToken {
    const accessToken = this._jwtHelperService.tokenGetter();
    const exp = this._jwtHelperService.getTokenExpirationDate(accessToken) || new Date();
    const refreshDelay = Math.max(0, Math.round((exp.getTime() - new Date().getTime()) * 0.8));
    return new RefreshToken({refreshDelay, fromInit});
  }

  private _getScopesFromToken(token: any): string[] {
    const scopesPath = this._config.scopesPath || ['scopes'];
    scopesPath.forEach(p => (token = token[p]));
    return token;
  }
}
