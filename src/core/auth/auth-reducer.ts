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

import {AuthActionsUnion, AuthActionTypes} from './auth-actions';
import {AuthApiActionsUnion, AuthApiActionTypes} from './auth-api-actions';
import {User} from './user';

export interface State {
  init: boolean;
  user: User | null;
  token: string | null;
}

export const initialState: State = {
  init: false,
  user: null,
  token: null,
};

export function reducer(
  state = initialState,
  action: AuthApiActionsUnion | AuthActionsUnion,
): State {
  switch (action.type) {
    case AuthApiActionTypes.LoginSuccess: {
      return {
        ...state,
        user: action.payload.user,
      };
    }

    case AuthActionTypes.Logout: {
      return {
        ...state,
        user: null,
      };
    }

    case AuthActionTypes.InitUserComplete: {
      return {...state, init: true, user: action.payload.user};
    }

    case AuthActionTypes.InitComplete: {
      return {...state, init: true};
    }

    default: {
      return state;
    }
  }
}

export const getInit = (state: State) => state.init;
export const getUser = (state: State) => state.user;
