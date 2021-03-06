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

import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AuthService} from './auth';
import {AuthEffects} from './auth-effects';
import {AuthGuard} from './auth-guard';
import {AuthHelper} from './auth-helper';
import {JwtHelperService} from './jwt-helper';
import {JwtInterceptor} from './jwt-interceptor';
import {LoginActionDirective, LoginPasswordDirective, LoginUsernameDirective} from './login';
import {reducers} from './reducers';

@NgModule({
  imports: [
    EffectsModule.forFeature([AuthEffects]),
    StoreModule.forFeature('auth', reducers),
  ],
  declarations: [
    LoginActionDirective,
    LoginPasswordDirective,
    LoginUsernameDirective,
  ],
  exports: [
    LoginActionDirective,
    LoginPasswordDirective,
    LoginUsernameDirective,
  ],
  providers: [AuthEffects, AuthGuard, AuthHelper, AuthService, JwtHelperService, JwtInterceptor]
})
export class AuthModule {
}
