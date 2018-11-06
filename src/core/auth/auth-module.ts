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

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {AuthService} from './auth';
import {AuthEffects} from './auth-effects';
import {AuthGuard} from './auth-guard';
import {AuthModuleOptions} from './auth-module-options';
import {AUTH_OPTIONS} from './auth-options-token';
import {JwtHelperService} from './jwt-helper';
import {JwtInterceptor} from './jwt-interceptor';
import {JWT_OPTIONS} from './jwt-options-token';
import {reducers} from './reducers';

@NgModule({
  imports: [
    StoreModule.forFeature('auth', reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  providers: [
    AuthEffects,
    AuthGuard,
    AuthService,
    JwtHelperService,
    JwtInterceptor
  ]
})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true
        },
        options.jwtOptionsProvider ||
        {
          provide: JWT_OPTIONS,
          useValue: options.jwtConfig
        },
        options.authOptionsProvider ||
        {
          provide: AUTH_OPTIONS,
          useValue: options.authConfig
        },
        JwtHelperService
      ]
    };
  }
}
