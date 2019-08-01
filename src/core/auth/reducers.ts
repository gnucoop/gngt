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

import {
  createSelector, createFeatureSelector, ActionReducerMap, MemoizedSelector
} from '@ngrx/store';

import * as fromRoot from '@gngt/core/reducers';
import * as fromAuth from './auth-reducer';
import * as fromLoginPage from './login-page-reducer';
import {AuthApiActionsUnion} from './auth-api-actions';
import {User} from './user';

export interface AuthState {
  status: fromAuth.State;
  loginPage: fromLoginPage.State;
}

export interface State extends fromRoot.State {
  auth: AuthState;
}

export const reducers: ActionReducerMap<AuthState, AuthApiActionsUnion> = {
  status: fromAuth.reducer,
  loginPage: fromLoginPage.reducer,
};

export const selectAuthState: MemoizedSelector<State, AuthState> =
    createFeatureSelector<State, AuthState>('auth');

export const selectAuthStatusState: MemoizedSelector<State, fromAuth.State> =
    createSelector(selectAuthState, (state: AuthState) => state.status);
export const getInit: MemoizedSelector<State, boolean> =
    createSelector(selectAuthStatusState, fromAuth.getInit);
export const getUser: MemoizedSelector<State, User | null> =
  createSelector(selectAuthStatusState, fromAuth.getUser);
export const getLoggedIn: MemoizedSelector<State, boolean> =
    createSelector(getUser, user => user != null);

export const selectLoginPageState: MemoizedSelector<State, fromLoginPage.State> =
    createSelector(selectAuthState, (state: AuthState) => state.loginPage);
export const getLoginPageError: MemoizedSelector<State, string|null> =
    createSelector(selectLoginPageState, fromLoginPage.getError);
export const getLoginPagePending: MemoizedSelector<State, boolean> =
    createSelector(selectLoginPageState, fromLoginPage.getPending);
